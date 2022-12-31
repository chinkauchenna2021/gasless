// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "./FixedPointTypes.sol";
import "../common.sol";

struct RouletteSessionCreationParams {
    /**
     * @notice An array of VF Ids.
     * Lower 5 bytes must be 0x00_00_00_00_00. Upper 27 bytes must be unique.
     * Since all VF-related functions accept this id as an argument,
     * it pays to choose an id with more zero-bytes, as these waste less intrinsic gas,
     * and the savings will add up in the long run.
     * Suggestion: This id could be of the form 0xVV_VV_VV_VV_00_00_00_00_00
     */
    uint256[] vfIds;

    /**
     * @notice Fee-rate to be applied to a winning VF's total committed funds.
     * Should be <= 1.0.
     * E.g. 2.5%, or 0.025, is specified as the value 0_025000_000000_000000
     */
    UFixed256x18 totalFeeRate_e18;

    /**
     * @notice Address of ERC-20 token used for commitments and payouts/refunds in this VF.
     */
    IERC20Upgradeable paymentToken;

    /**
     * @notice Commitment-period begins as soon as a VF is created, but up until tOpen, beta is fixed at betaOpen.
     * tOpen is the timestamp at which beta starts decreasing.
     */
    uint32 tOpen;

    /**
     * @notice The official timestamp at which the result is known. VF can be resolved from tResolve onwards.
     */
    uint32 tResolve;

    /**
     * @notice Number of mutually-exclusive outcomes for this VF.
     */
    uint8 nOutcomes;

    /**
     * @notice An optional amount of payment-token to deposit into the VF as a incentive.
     * this amount matches each vf at each index,
     * bonusAmount will contribute toward winnings if VF is concluded with winners,
     * and will be refunded to creator if VF is cancelled.
     * Creator account must have pre-approved the bonusAmount as spending allowance to this contract.
     */
    uint256[] bonusAmounts;

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
}