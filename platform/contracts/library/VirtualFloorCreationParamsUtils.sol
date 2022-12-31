// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "../DoubleDiceProtocol.sol";
import "../IDoubleDiceApplication.sol";
import "./FixedPointTypes.sol";
import "./ERC1155TokenIds.sol";
import "./VirtualFloors.sol";
import "../common.sol";

struct VirtualFloorCreationParams {

    /**
     * @notice The VF id.
     * Lower 5 bytes must be 0x00_00_00_00_00. Upper 27 bytes must be unique.
     * Since all VF-related functions accept this id as an argument,
     * it pays to choose an id with more zero-bytes, as these waste less intrinsic gas,
     * and the savings will add up in the long run.
     * Suggestion: This id could be of the form 0xVV_VV_VV_VV_00_00_00_00_00
     */
    uint256 vfId;

    /**
     * @notice Opening beta-multiplier value.
     * This is the beta value at tOpen. The value of beta is fixed at betaOpen up until tOpen, then decreases linearly with time to 1.0 at tClose.
     * Should be >= 1.0.
     * E.g. 23.4 is specified as 23_400000_000000_000000
     */
    UFixed256x18 betaOpen_e18;

    /**
     * @notice Fee-rate to be applied to a winning VF's total committed funds.
     * Should be <= 1.0.
     * E.g. 2.5%, or 0.025, is specified as the value 0_025000_000000_000000
     */
    UFixed256x18 totalFeeRate_e18;

    /**
     * @notice Commitment-period begins as soon as a VF is created, but up until tOpen, beta is fixed at betaOpen.
     * tOpen is the timestamp at which beta starts decreasing.
     */
    uint32 tOpen;

    /**
     * @notice Commitment-period closes at tClose.
     */
    uint32 tClose;

    /**
     * @notice The official timestamp at which the result is known. VF can be resolved from tResolve onwards.
     */
    uint32 tResolve;

    /**
     * @notice Number of mutually-exclusive outcomes for this VF.
     */
    uint8 nOutcomes;

    /**
     * @notice Address of ERC-20 token used for commitments and payouts/refunds in this VF.
     */
    IERC20Upgradeable paymentToken;

    /**
     * @notice An optional amount of payment-token to deposit into the VF as a incentive.
     * bonusAmount will contribute toward winnings if VF is concluded with winners,
     * and will be refunded to creator if VF is cancelled.
     * Creator account must have pre-approved the bonusAmount as spending allowance to this contract.
     */
    uint256 bonusAmount;

    /**
     * @notice The minimum amount of payment-token that should be committed to this VF per-commitment.
     * If left unspecified (by passing 0), will default to the minimum non-zero possible ERC-20 amount.
     */
    uint256 optionalMinCommitmentAmount;

    /**
     * @notice The maximum amount of payment-token that can be committed to this VF per-commitment.
     * If left unspecified (by passing 0), will default to no-maximum.
     */
    uint256 optionalMaxCommitmentAmount;

    /**
     * @notice Encoded VF metadata.
     */
    EncodedVirtualFloorMetadata metadata;

    address creator;
}


/**
 * @title VirtualFloorCreationParams object methods
 * @author 🎲🎲 <dev@doubledice.com>
 */
library VirtualFloorCreationParamsUtils {

    using ERC1155TokenIds for uint256;
    using FixedPointTypes for UFixed256x18;


    /**
     * @notice A VF id's lower 5 bytes must be 0x00_00_00_00_00
     */
    error InvalidVirtualFloorId();

    /**
     * @notice totalFeeRate <= 1.0 not satisfied
     * @dev To be renamed to `TotalFeeRateTooLarge`.
     */
    error CreationFeeRateTooLarge();

    /**
     * @notice nOutcomes >= 2 not satisfied
     */
    error NotEnoughOutcomes();

    /**
     * @notice nOutcomes <= _MAX_OUTCOMES_PER_VIRTUAL_FLOOR not satisfied
     */
    error TooManyOutcomes();


    function validatePure(VirtualFloorCreationParams calldata params) internal pure {
        if (!(params.vfId != 0)) revert InvalidVirtualFloorId(); // ToDo: Before upgrade ensure no such VFs exist
        if (!params.vfId.isValidVirtualFloorId()) revert InvalidVirtualFloorId();
        if (!(params.totalFeeRate_e18.lte(UFIXED256X18_ONE))) revert CreationFeeRateTooLarge();
        if (!(params.tOpen < params.tClose && params.tClose <= params.tResolve)) revert InvalidTimeline();
        if (!(params.nOutcomes >= 2)) revert NotEnoughOutcomes();
        if (!(params.nOutcomes <= _MAX_OUTCOMES_PER_VIRTUAL_FLOOR)) revert TooManyOutcomes();
    }


    /**
     * @dev Allow creation to happen up to 10% into the period tOpen ≤ t ≤ tClose, to tolerate mining delays.
     */
    function tCreateMax(VirtualFloorCreationParams calldata params) internal pure returns (uint256) {
        return params.tOpen + (params.tClose - params.tOpen) / 10;
    }

}
