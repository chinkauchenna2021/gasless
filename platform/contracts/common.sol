// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

error UnsupportedLegacyVf();

uint256 constant UNSPECIFIED_ZERO = 0;


/**
  * @notice VF timeline does not satisfy relation tOpen < tClose <= tResolve
  */
error InvalidTimeline();

/**
 * @notice Versioned & abi-encoded VF metadata
 * @dev BaseDoubleDice.createVirtualFloor treats VF metadata as opaque bytes.
 * In this way, contract can be upgraded to new metadata formats without altering createVirtualFloor signature.
 */
struct EncodedVirtualFloorMetadata {
    /**
     * @notice Version that determines how the encoded metadata bytes are decoded.
     */
    bytes32 version;

    /**
     * @notice Encoded metadata.
     */
    bytes data;
}

/**
 * @notice Chainlink configuration parameter for contracts.
 */
struct ChainlinkConfig {
    address vrfCoordinator;
    bytes32 keyHash;
    uint64 subId;
    uint16 minRequestConfirmations;
    uint32 callbackGasLimit;
    address linkToken;
}