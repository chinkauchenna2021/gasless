// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";

import "./BaseClassicDoubleDiceApp.sol";
import "../../Resolution.sol";

/**
 * @title ChallengeableCreatorOracle extension of BaseDoubleDice contract
 * @author 🎲🎲 <dev@doubledice.com>
 * @notice This contract extends the BaseDoubleDice contract to allow VFs to be resolved by VF-creator,
 * and to subsequently allow that set result to be challenged by a member of the public.
 */
abstract contract ChallengeableCreatorOracle is BaseClassicDoubleDiceApp {

    using SafeERC20Upgradeable for IERC20MetadataUpgradeable;
    using SafeCastUpgradeable for uint256;


    uint256 constant public CHALLENGE_BOND_USD_AMOUNT = 100;

    uint256 constant public SET_WINDOW_DURATION = 1 hours;

    uint256 constant public CHALLENGE_WINDOW_DURATION = 1 hours;


    /**
     * @notice The ERC-20 token in which potential VF result challenger must place bond. Configured as USDC.
     */
    IERC20MetadataUpgradeable immutable public bondUsdErc20Token;

    uint256 immutable public bondAmount;

    constructor(DoubleDiceProtocol protocol, IERC20MetadataUpgradeable bondUsdErc20Token_) BaseClassicDoubleDiceApp(protocol) {
        bondUsdErc20Token = bondUsdErc20Token_;
        bondAmount = CHALLENGE_BOND_USD_AMOUNT * (10 ** bondUsdErc20Token_.decimals());        
    }

    mapping(uint256 => Resolution) public _resolutions;


    function resolutions(uint256 vfId) external view returns (Resolution memory resolution) {
        if (address(PROTOCOL.getVirtualFloorApplication(vfId)) == address(0)) {
            (
                resolution.state, 
                resolution.setOutcomeIndex, 
                resolution.tResultChallengeMax, 
                resolution.challengeOutcomeIndex, 
                resolution.challenger
            ) = PROTOCOL.legacyResolutions(vfId);
        } else {
            resolution = _resolutions[vfId];
        }
    }

    function _getResolution(uint256 vfId) private view returns (Resolution storage) {
        if (address(PROTOCOL.getVirtualFloorApplication(vfId)) == address(0)) revert UnsupportedLegacyVf();
        return _resolutions[vfId];
    }

    enum ResultUpdateAction {
        OperatorFinalizedUnsetResult,
        CreatorSetResult,
        SomeoneConfirmedUnchallengedResult,
        SomeoneChallengedSetResult,
        OperatorFinalizedChallenge
    }

    event ResultUpdate(
        uint256 indexed vfId,
        address operator,
        ResultUpdateAction action,
        uint8 outcomeIndex
    );

    /**
    * @notice VF resolution is in state `actualState`, but it must be in a different state to execute this action.
    */
    error WrongResolutionState(ResolutionState actualState);


    /**
     * @notice Operator: Set VF result if VF-creator has not set it within 1 hour of tResolve.
     * @dev No checks are made on whether finalOutcomeIndex is in-range,
     * or on whether underlying VF is in the ClosedResolvable state,
     * as BaseDoubleDice._resolve call will fail anyway if requirements are not satisfied.
     */
    function finalizeUnsetResult(uint256 vfId, uint8 finalOutcomeIndex)
        external
        onlyRole(OPERATOR_ROLE)
    {
        Resolution storage resolution = _getResolution(vfId);
        if (!(resolution.state == ResolutionState.None)) revert WrongResolutionState(resolution.state);
        DoubleDiceProtocol.CreatedVirtualFloorParams memory vfParams = PROTOCOL.getVirtualFloorParams(vfId);
        uint256 tResultSetMax = vfParams.tResolve + SET_WINDOW_DURATION;

        // CR-01: If block.timestamp is just a few seconds past tResultSetMax,
        // manipulating block.timestamp by a few seconds to be <= tResultSetMax
        // will cause this transaction to fail.
        // If that were to happen, this transaction could simply be reattempted later.
        // solhint-disable-next-line not-rely-on-time
        if (!(block.timestamp > tResultSetMax)) revert TooEarly();

        resolution.state = ResolutionState.Complete;
        emit ResultUpdate(vfId, _msgSender(), ResultUpdateAction.OperatorFinalizedUnsetResult, finalOutcomeIndex);

        // nonReentrant
        // Since finalizeUnsetResult is guarded by require(state == None)
        // and state has now been moved to Complete,
        // any external calls made by _resolve cannot re-enter finalizeUnsetResult.
        PROTOCOL.resolve(vfId, 1 << finalOutcomeIndex, PROTOCOL.platformFeeBeneficiary());
    }

    /**
     * @notice VF creator: Set VF result within 1 hour of tResolve.
     * @dev No checks are made on whether finalOutcomeIndex is in-range,
     * or on whether underlying VF is in the ClosedResolvable state,
     * as BaseDoubleDice._resolve call will fail anyway if requirements are not satisfied.
     */
    function setResult(uint256 vfId, uint8 setOutcomeIndex)
        external
        whenNotPaused
    {
        VirtualFloorState state = PROTOCOL.getVirtualFloorState(vfId);
        if (!(state == VirtualFloorState.Active_Closed_ResolvableNow)) revert WrongVirtualFloorState(state);
        DoubleDiceProtocol.CreatedVirtualFloorParams memory vfParams = PROTOCOL.getVirtualFloorParams(vfId);
        if (!(_msgSender() == vfParams.creator)) revert UnauthorizedMsgSender();
        Resolution storage resolution = _getResolution(vfId);
        if (!(resolution.state == ResolutionState.None)) revert WrongResolutionState(resolution.state);
        uint256 tResultSetMax = vfParams.tResolve + SET_WINDOW_DURATION;

        // CR-01: If block.timestamp is at just a few seconds before tResultSetMax,
        // manipulating block.timestamp by a few seconds to be > tResultSetMax
        // will cause this transaction to fail.
        // In that were to happen, it would then become the DoubleDice admin's reponsibility
        // to set the result via finalizeUnsetResult.
        // solhint-disable-next-line not-rely-on-time
        if (!(block.timestamp <= tResultSetMax)) revert TooLate();

        if (!(setOutcomeIndex < vfParams.nOutcomes)) revert OutcomeIndexOutOfRange();

        // CR-01: Regardless of whether block.timestamp has been manipulated by a few seconds or not,
        // tResultChallengeMax will always be set to CHALLENGE_WINDOW_DURATION seconds later.
        // solhint-disable-next-line not-rely-on-time
        resolution.tResultChallengeMax = (block.timestamp + CHALLENGE_WINDOW_DURATION).toUint32();

        resolution.setOutcomeIndex = setOutcomeIndex;
        resolution.state = ResolutionState.Set;
        emit ResultUpdate(vfId, _msgSender(), ResultUpdateAction.CreatorSetResult, setOutcomeIndex);
    }

    /**
     * @notice Confirm a VF result that was set by VF-creator more than 1 hour ago,
     * and was not challenged by anyone.
     * @dev Callable by anyone.
     */
    function confirmUnchallengedResult(uint256 vfId)
        external
        whenNotPaused
    {
        Resolution storage resolution = _getResolution(vfId);
        if (!(resolution.state == ResolutionState.Set)) revert WrongResolutionState(resolution.state);

        // CR-01: If block.timestamp is just a few seconds past tResultChallengeMax,
        // manipulating block.timestamp by a few seconds to be <= tResultChallengeMax
        // will cause this transaction to fail.
        // If that were to happen, this transaction could simply be reattempted later.
        // solhint-disable-next-line not-rely-on-time
        if (!(block.timestamp > resolution.tResultChallengeMax)) revert TooEarly();

        resolution.state = ResolutionState.Complete;
        address creatorFeeBeneficiary = PROTOCOL.getVirtualFloorCreator(vfId);
        emit ResultUpdate(vfId, _msgSender(), ResultUpdateAction.SomeoneConfirmedUnchallengedResult, resolution.setOutcomeIndex);

        // nonReentrant
        // Since confirmUnchallengedResult is guarded by require(state == Set)
        // and state has now been moved to Complete,
        // any external calls made by _resolve cannot re-enter confirmUnchallengedResult.
        PROTOCOL.resolve(vfId, 1 << resolution.setOutcomeIndex, creatorFeeBeneficiary);
    }


    /**
     * @notice VF result cannot be challenged with the same outcome set by creator.
     */
    error ChallengeOutcomeIndexEqualToSet();

    /**
     * @notice Challenge a VF result that has been set by VF-creator,
     * but for which 1-hour challenge-period has not yet expired,
     * and set result has not been yet challenged by anyone else.
     * Caller must have pre-approved 100 USDC spending allowance to this contract,
     * and transaction will result in 100 USDC challenge-bond being transferred
     * from the caller to this contract.
     * Bond will be returned if challenge is correct,
     * or if VF ends up being cancelled because it is flagged.
     * @param vfId VF id
     * @param challengeOutcomeIndex 0-based index of VF outcome that is the correct result according to challenger.
     * Must be different than the the result set previously by VF-creator that is being challenged.
     * @dev Callable by anyone.
     */
    function challengeSetResult(uint256 vfId, uint8 challengeOutcomeIndex)
        external
        whenNotPaused
    {
        Resolution storage resolution = _getResolution(vfId);
        if (!(resolution.state == ResolutionState.Set)) revert WrongResolutionState(resolution.state);
        DoubleDiceProtocol.CreatedVirtualFloorParams memory vfParams = PROTOCOL.getVirtualFloorParams(vfId);
        if (!(challengeOutcomeIndex < vfParams.nOutcomes)) revert OutcomeIndexOutOfRange();
        if (!(challengeOutcomeIndex != resolution.setOutcomeIndex)) revert ChallengeOutcomeIndexEqualToSet();

        // CR-01: If block.timestamp is at just a few seconds before tResultChallengeMax,
        // manipulating block.timestamp by a few seconds to be > tResultChallengeMax
        // will cause this transaction to fail.
        // If that were to happen, it would then become possible for the unchallenged result
        // to be confirmed via confirmUnchallengedResult, thus concluding the VF.
        // To protect against this scenario, CHALLENGE_WINDOW_DURATION is configured to be
        // much larger than the amount of time by which a miner could possibly manipulate block.timestamp.
        // solhint-disable-next-line not-rely-on-time
        if (!(block.timestamp <= resolution.tResultChallengeMax)) revert TooLate();

        resolution.challengeOutcomeIndex = challengeOutcomeIndex;
        resolution.challenger = _msgSender();
        resolution.state = ResolutionState.Challenged;
        emit ResultUpdate(vfId, _msgSender(), ResultUpdateAction.SomeoneChallengedSetResult, challengeOutcomeIndex);

        // nonReentrant
        // Since challengeSetResult is guarded by require(state == Set)
        // and state has now been moved to Challenged,
        // the following external safeTransferFrom call cannot re-enter challengeSetResult.
        bondUsdErc20Token.safeTransferFrom(_msgSender(), address(this), bondAmount);
    }


    /**
     * @notice Operator: Finalize VF result that has been challenged.
     * @param vfId VF id
     * @param finalOutcomeIndex 0-based index of correct VF outcome.
     */
    function finalizeChallenge(uint256 vfId, uint8 finalOutcomeIndex)
        external
        onlyRole(OPERATOR_ROLE)
    {
        Resolution storage resolution = _getResolution(vfId);
        if (!(resolution.state == ResolutionState.Challenged)) revert WrongResolutionState(resolution.state);
        address creatorFeeBeneficiary;
        address challengeBondBeneficiary;
        if (finalOutcomeIndex == resolution.setOutcomeIndex) {
            // VF-owner proven correct
            creatorFeeBeneficiary = PROTOCOL.getVirtualFloorCreator(vfId);
            challengeBondBeneficiary = PROTOCOL.platformFeeBeneficiary();
        } else if (finalOutcomeIndex == resolution.challengeOutcomeIndex) {
            // Challenger proven correct
            creatorFeeBeneficiary = PROTOCOL.platformFeeBeneficiary();
            challengeBondBeneficiary = resolution.challenger;
        } else {
            // Neither VF-owner nor challenger were correct
            creatorFeeBeneficiary = PROTOCOL.platformFeeBeneficiary();
            challengeBondBeneficiary = PROTOCOL.platformFeeBeneficiary();
        }
        resolution.state = ResolutionState.Complete;
        emit ResultUpdate(vfId, _msgSender(), ResultUpdateAction.OperatorFinalizedChallenge, finalOutcomeIndex);

        // nonReentrant
        // Since finalizeChallenge is guarded by require(state == Challenged)
        // and state has now been moved to Complete,
        // the external safeTransfer call, as well as any external calls made by _resolve,
        // cannot re-enter finalizeChallenge.
        bondUsdErc20Token.safeTransfer(challengeBondBeneficiary, bondAmount);
        PROTOCOL.resolve(vfId, 1 << finalOutcomeIndex, creatorFeeBeneficiary);
    }

    /**
     * @dev If the underlying VF has been cancelled after being flagged,
     * and a challenger had paid a challenge-bond, that bond will be refunded to the challenger.
     */
    function _onChallengeableCreatorOracleVirtualFloorConclusion(uint256 vfId) internal {
        if (PROTOCOL.getVirtualFloorState(vfId) == VirtualFloorState.Claimable_Refunds_Flagged) {
            Resolution storage resolution = _getResolution(vfId);
            if (resolution.state == ResolutionState.Challenged) {
                resolution.state = ResolutionState.ChallengeCancelled;
                bondUsdErc20Token.safeTransfer(resolution.challenger, bondAmount);
            }
        }
    }

    /**
     * @dev See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
