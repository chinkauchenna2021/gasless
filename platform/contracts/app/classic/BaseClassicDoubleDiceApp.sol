// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "../../common.sol";
import "../../DoubleDiceProtocol.sol";


/**
 * @dev Estimate of max(world timestamp - block.timestamp)
 */
uint256 constant _MAX_POSSIBLE_BLOCK_TIMESTAMP_DISCREPANCY = 60 seconds;

uint256 constant _MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE = 10 * _MAX_POSSIBLE_BLOCK_TIMESTAMP_DISCREPANCY;


/**
  * @notice betaOpen >= 1.0 not satisfied
  */
error BetaOpenTooSmall();


abstract contract BaseClassicDoubleDiceApp is
    AccessControlUpgradeable,
    PausableUpgradeable
{
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    DoubleDiceProtocol immutable public PROTOCOL;

    constructor(DoubleDiceProtocol protocol) {
        PROTOCOL = protocol;
    }

    event VirtualFloorCreation(
        uint256 indexed vfId,
        UFixed256x18 betaOpen_e18,
        uint32 tOpen,
        EncodedVirtualFloorMetadata metadata
    );

    uint256[50] private __gap;
}
