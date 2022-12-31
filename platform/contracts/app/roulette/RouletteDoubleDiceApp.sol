// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";

import "../../common.sol";
import "../../impl/ChainlinkVRFv2SubscriptionManager.sol";
import "../../DoubleDiceProtocol.sol";
import "../../library/FixedPointTypes.sol";
import "../../library/VirtualFloors.sol";
import "../../library/RouletteCreationParamUtils.sol";
import "hardhat/console.sol";

contract RouletteDoubleDiceApp is
    Initializable,
    AccessControlUpgradeable,
    ChainlinkVRFv2SubscriptionManager,
    IDoubleDiceApplication,
    ERC2771Context
{
    using FixedPointTypes for UFixed256x18;
    using SafeCastUpgradeable for uint256;

    // Each roulette session Id. We are using a uint256 just to keep things simple.
    uint256 private _tableIds = 0;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(DoubleDiceProtocol protocol, ChainlinkConfig memory chainlinkConfig, address trustedForwarder)
        ChainlinkVRFv2SubscriptionManager(protocol, chainlinkConfig)
        initializer
        ERC2771Context(trustedForwarder)
    { // solhint-disable-line no-empty-blocks
    }

    // solhint-disable-next-line no-empty-blocks
    function initialize() external initializer {
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     * @notice Stores request Ids for every VF.
     */
    mapping(uint256 => uint256) public vfIdsByRequestId;

    event RouletteSessionCreation(
        uint256 indexed tableId,
        uint256[] vfIds,
        uint256[] bonusAmounts,
        uint32 tOpen,
        uint32 tResolve,
        EncodedVirtualFloorMetadata metadata
    );

    /**
     * @notice VF ids is equal to zero.
     */
    error InvalidNumRounds();

    /**
     * @notice bonusAmounts.length  != vfIds.length.
     */
    error BonusAmountAndVfIdMismatch();


  function _msgSender() internal view override(ContextUpgradeable, ERC2771Context)
      returns (address sender) {
      sender = ERC2771Context._msgSender();
  }

  function _msgData() internal view override(ContextUpgradeable, ERC2771Context)
      returns (bytes calldata) {
      return ERC2771Context._msgData();
  }

    function createRouletteSession(RouletteSessionCreationParams memory sessionParams) external  {

        if (sessionParams.vfIds.length <= 0) revert InvalidNumRounds();
        if (sessionParams.bonusAmounts.length != sessionParams.vfIds.length) revert BonusAmountAndVfIdMismatch();

        _createVirtualFloor(sessionParams);

        _tableIds++;

        emit RouletteSessionCreation({
            vfIds: sessionParams.vfIds,
            tableId: _tableIds,
            bonusAmounts: sessionParams.bonusAmounts,
            tOpen: sessionParams.tOpen,
            tResolve: sessionParams.tResolve,
            metadata: sessionParams.metadata
        });
    }

    function commitToVirtualFloor(uint256 vfId, uint8[] calldata outcomeIndexes, uint256[] calldata amounts, uint256 optionalDeadline) external {
        PROTOCOL.commitToVirtualFloor(vfId, _msgSender(), outcomeIndexes, amounts, optionalDeadline);
    }

    event VirtualFloorResolution(
        uint256 indexed vfId,
        uint256 requestId
    );
    function resolveVirtualFloor(uint256 vfId) external {
        uint256 requestId = requestRandomWords(1);

        if (requestId == 0) revert ZeroRequestId();
        if (vfIdsByRequestId[requestId] != 0) revert RequestIdAlreadyExist();

        vfIdsByRequestId[requestId] = vfId;

        emit VirtualFloorResolution({
            vfId: vfId,
            requestId: requestId
        });
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 vfId = vfIdsByRequestId[requestId];

        if (vfId == 0) revert InvalidVFId();
        if (randomWords.length != 1) revert InvalidRandomWords();

        DoubleDiceProtocol.CreatedVirtualFloorParams memory vfParams = PROTOCOL.getVirtualFloorParams(vfId);
        uint256 winningOutcomeIndex = randomWords[0] % vfParams.nOutcomes;
        address creator = PROTOCOL.getVirtualFloorCreator(vfId);
        PROTOCOL.resolve({
            vfId: vfId,
            winningOutcomeIndexFlags: 1 << winningOutcomeIndex,
            creatorFeeBeneficiary: creator
        });
    }

    function _createVirtualFloor(RouletteSessionCreationParams memory sessionParams) internal {

        uint8 nRounds = sessionParams.vfIds.length.toUint8();
        uint256 roundMilliseconds = (sessionParams.tResolve - sessionParams.tOpen) / nRounds;

        for (uint8 i = 0; i < nRounds; i++) {

            uint32 tResolve = (sessionParams.tOpen + (roundMilliseconds * (i + 1))).toUint32();
            uint32 tOpen = (tResolve - roundMilliseconds).toUint32();

            VirtualFloorCreationParams memory vfParams = VirtualFloorCreationParams({
                vfId: sessionParams.vfIds[i],
                betaOpen_e18: UFIXED256X18_ONE,
                totalFeeRate_e18: sessionParams.totalFeeRate_e18,
                tOpen: tOpen,
                tClose: tResolve,
                tResolve: tResolve,
                nOutcomes: sessionParams.nOutcomes,
                paymentToken: sessionParams.paymentToken,
                bonusAmount: sessionParams.bonusAmounts[i],
                optionalMinCommitmentAmount: sessionParams.optionalMinCommitmentAmount,
                optionalMaxCommitmentAmount: sessionParams.optionalMaxCommitmentAmount,
                metadata: sessionParams.metadata,
                creator: _msgSender()
            });

            PROTOCOL.createVirtualFloor(vfParams);
        }

        // We transfer the fee used to generate RNG to chainlink subscription
        _topUpSubscription(nRounds);

    }

    function _topUpSubscription(uint8 nRounds) internal {
        uint256 fee = rngFee * nRounds;

        _CHAINLINK_TOKEN.transferFrom(_msgSender(), address(this), fee);
        _CHAINLINK_TOKEN.transferAndCall(address(_CHAINLINK_VRF_COORDINATOR), fee, abi.encode(_CHAINLINK_SUBSCRIPTION_ID));
    }

    function getCurrentTableId() public view returns(uint256) {
        return _tableIds;
    }

    // solhint-disable-next-line no-empty-blocks
    function onVirtualFloorConclusion(uint256 vfId) external {
    }

    function betaOf(uint256 /*vfId*/, uint8 /*outcomeIndex*/, uint256 /*timestamp*/) external pure returns (UFixed32x6) {
        return UFIXED32X6_ONE;
    }

    /**
     * @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}