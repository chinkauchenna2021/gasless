// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "../../IDoubleDiceApplication.sol";

import "./ChallengeableCreatorOracle.sol";
import "./CreationQuotas.sol";
import "./VirtualFloorMetadataValidator.sol";

/**
 *                            ________
 *                 ________  / o   o /\
 *                /     o /\/   o   /o \
 *               /   o   /  \o___o_/o   \
 *              /_o_____/o   \     \   o/
 *              \ o   o \   o/  o   \ o/
 *  ______     __\ o   o \  /\_______\/       _____     ____    ____    ____   _______
 * |  __  \   /   \_o___o_\/ |  _ \  | |     |  ___|   |  _ \  |_  _|  / ___| |   ____|
 * | |  \  | | / \ | | | | | | |_| | | |     | |_      | | \ |   ||   | /     |  |
 * | |   | | | | | | | | | | |  _ <  | |     |  _|     | | | |   I|   | |     |  |__
 * |D|   |D| |O\_/O| |U|_|U| |B|_|B| |L|___  |E|___    |D|_/D|  _I|_  |C\___  |EEEEE|
 * |D|__/DD|  \OOO/   \UUU/  |BBBB/  |LLLLL| |EEEEE|   |DDDD/  |IIII|  \CCCC| |EE|____
 * |DDDDDD/  ================================================================ |EEEEEEE|
 *
 * @title DoubleDice protocol contract
 * @author 🎲🎲 <dev@doubledice.com>
 * @custom:security-contact dev@doubledice.com
 * @notice Enables accounts to commit an amount of ERC-20 tokens to a prediction that a specific future event,
 * or VirtualFloor (VF), resolves to a specific outcome from a predefined list of 2 or more mutually-exclusive
 * possible outcomes.
 * Users committing funds to a specific VF outcome at a specific timepoint are issued with a commitment receipt
 * in the form of a ERC-1155 commitment-balance.
 * If a VF is resolved to a winning outcome and winner profits are available, the commitment-balance may be redeemed
 * by its holder for the corresponding share of the profit.
 * @dev Merges all the multiple BaseDoubleDice contract extensions into one final contract.
 */
contract ClassicDoubleDiceApp is
    IDoubleDiceApplication,
    ChallengeableCreatorOracle,
    CreationQuotas
{
    using FixedPointTypes for UFixed256x18;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(DoubleDiceProtocol protocol, IERC20MetadataUpgradeable bondUsdErc20Token)
        ChallengeableCreatorOracle(protocol, bondUsdErc20Token)
        initializer
    { // solhint-disable-line no-empty-blocks
    }

    function initialize() external initializer {
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function createVirtualFloor(VirtualFloorCreationParams calldata params) external {
        if (!(_msgSender() == params.creator)) revert UnauthorizedMsgSender();
        if (!(params.betaOpen_e18.gte(_BETA_CLOSE))) revert BetaOpenTooSmall();
        if (!(params.tClose + _MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE <= params.tResolve)) revert InvalidTimeline();

        PROTOCOL.createVirtualFloor(params);

        _onCreationQuotasVirtualFloorCreation(params);
        VirtualFloorMetadataValidator.validate(params.metadata, params.nOutcomes);

        emit VirtualFloorCreation({
            vfId: params.vfId,
            betaOpen_e18: params.betaOpen_e18,
            tOpen: params.tOpen,
            metadata: params.metadata
        });
    }

    function commitToVirtualFloor(uint256 vfId, uint8[] memory outcomeIndexes, uint256[] memory amounts, uint256 optionalDeadline) external {
        PROTOCOL.commitToVirtualFloor(vfId, _msgSender(), outcomeIndexes, amounts, optionalDeadline);
    }

    function onVirtualFloorConclusion(uint256 vfId) external {
        if (!(_msgSender() == address(PROTOCOL))) revert UnauthorizedMsgSender();
        _onChallengeableCreatorOracleVirtualFloorConclusion(vfId);
        _onCreationQuotasVirtualFloorConclusion(vfId);
    }

    /**
     * @dev Compare:
     * 1. (((tClose - t) * (betaOpen - 1)) / (tClose - tOpen)) * amount
     * 2. (((tClose - t) * (betaOpen - 1) * amount) / (tClose - tOpen))
     * (2) has less rounding error than (1), but then the *precise* effective beta used in the computation might not
     * have a uint256 representation.
     * Therefore some (miniscule) rounding precision is sacrificed to gain computation reproducibility.
     */
    function betaOf(uint256 vfId, uint8 /*outcomeIndex*/, uint256 timestamp) external view returns (UFixed32x6) {
        // ToDo: Optimize by replicating tOpen & tClose directly on this contract during createVirtualFloor
        DoubleDiceProtocol.CreatedVirtualFloorParams memory vfParams = PROTOCOL.getVirtualFloorParams(vfId);

        uint256 timeslot = MathUpgradeable.max(vfParams.tOpen, timestamp);

        UFixed256x18 betaOpenMinusBetaClose = vfParams.betaOpen_e18.sub(_BETA_CLOSE);
        UFixed256x18 beta = _BETA_CLOSE.add(betaOpenMinusBetaClose.mul0(vfParams.tClose - timeslot).div0(vfParams.tClose - vfParams.tOpen));

        return beta.toUFixed32x6Lossy();
    }

}
