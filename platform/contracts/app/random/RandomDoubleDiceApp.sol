// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";

import "../../common.sol";
import "../../DoubleDiceProtocol.sol";
import "../../library/FixedPointTypes.sol";
import "../../impl/ChainlinkVRFv2SubscriptionManager.sol";

contract RandomDoubleDiceApp is
    Initializable,
    AccessControlUpgradeable,
    ChainlinkVRFv2SubscriptionManager,
    IDoubleDiceApplication
{
    using FixedPointTypes for UFixed256x18;
    using SafeCastUpgradeable for uint256;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(DoubleDiceProtocol protocol, ChainlinkConfig memory chainlinkConfig)
        ChainlinkVRFv2SubscriptionManager(protocol, chainlinkConfig)
        initializer
    { // solhint-disable-line no-empty-blocks
    }

    // solhint-disable-next-line no-empty-blocks
    function initialize() external initializer {
    }

    mapping(uint256 => uint256) public vfIdsByRequestId;

    event VirtualFloorCreation(
        uint256 indexed vfId
    );

    function createVirtualFloor(uint256 vfId, uint32 tResolve, IERC20Upgradeable paymentToken) external {
        VirtualFloorCreationParams memory params = VirtualFloorCreationParams({
            vfId: vfId,
            betaOpen_e18: UFIXED256X18_ONE, // ToDo: Drop (app-specific)
            totalFeeRate_e18: FixedPointTypes.toUFixed256x18(5).div0(100), // 5%
            tOpen: block.timestamp.toUint32(), // ToDo: Drop
            tClose: tResolve,
            tResolve: tResolve,
            nOutcomes: 6,
            paymentToken: paymentToken,
            bonusAmount: 0,
            optionalMinCommitmentAmount: UNSPECIFIED_ZERO, // ToDo: Drop (app-specific)
            optionalMaxCommitmentAmount: UNSPECIFIED_ZERO, // ToDo: Drop (app-specific)
            metadata: EncodedVirtualFloorMetadata({ version: bytes32(uint256(2)), data: hex"" }), // ToDo: Drop (app-specific)
            creator: _msgSender()
        });
        PROTOCOL.createVirtualFloor(params);
        emit VirtualFloorCreation({
            vfId: params.vfId
        });
    }

    function commitToVirtualFloor(uint256 vfId, uint8[] calldata outcomeIndexes, uint256[] calldata amounts) external {
        PROTOCOL.commitToVirtualFloor(vfId, _msgSender(), outcomeIndexes, amounts, UNSPECIFIED_ZERO);
    }

    function resolve(uint256 vfId) external {
         uint256 requestId = requestRandomWords(1);

        if (requestId == 0) revert ZeroRequestId();
        if (vfIdsByRequestId[requestId] != 0) revert RequestIdAlreadyExist();

        vfIdsByRequestId[requestId] = vfId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
         uint256 vfId = vfIdsByRequestId[requestId];

        if (vfId == 0) revert InvalidVFId();
        if (randomWords.length != 1) revert InvalidRandomWords();

        uint256 winningOutcomeIndex = randomWords[0] % 6;
        address creator = PROTOCOL.getVirtualFloorCreator(vfId);
        PROTOCOL.resolve({
            vfId: vfId,
            winningOutcomeIndexFlags: 1 << winningOutcomeIndex,
            creatorFeeBeneficiary: creator
        });
    }

    // solhint-disable-next-line no-empty-blocks
    function onVirtualFloorConclusion(uint256 vfId) external {
    }

    function betaOf(uint256 /*vfId*/, uint8 /*outcomeIndex*/, uint256 /*timestamp*/) external pure returns (UFixed32x6) {
        return UFIXED32X6_ONE;
    }

}
