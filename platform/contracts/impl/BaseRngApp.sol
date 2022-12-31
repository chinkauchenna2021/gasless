// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "../DoubleDiceProtocol.sol";


abstract contract BaseRngApp is
    AccessControlUpgradeable,
    PausableUpgradeable
{
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    DoubleDiceProtocol immutable public PROTOCOL;

    /**
     * @notice RequestId is 0.
     */
    error ZeroRequestId();

    /**
     * @notice RequestId already exist.
     */
    error RequestIdAlreadyExist();

    /**
     * @notice VFId doesn't exist.
     */
    error InvalidVFId();

    /**
     * @notice RandomWords length must be equal to 1.
     */
    error InvalidRandomWords();

    constructor(DoubleDiceProtocol protocol) {
        PROTOCOL = protocol;
    }

    uint256[50] private __gap;
}
