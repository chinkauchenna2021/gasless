// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import "./library/FixedPointTypes.sol";

// solhint-disable-next-line no-empty-blocks
interface IDoubleDiceApplication {  

    function onVirtualFloorConclusion(uint256 vfId) external;

    function betaOf(uint256 vfId, uint8 outcomeIndex, uint256 timestamp) external view returns (UFixed32x6);

}
