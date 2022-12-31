// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.12;

import "../../DoubleDiceProtocol.sol";
import "../../IDoubleDiceApplication.sol";
import "../../library/FixedPointTypes.sol";


contract SimpleOracle is IDoubleDiceApplication {

    DoubleDiceProtocol immutable public PROTOCOL;

    constructor(DoubleDiceProtocol protocol) {
        PROTOCOL = protocol;
    }

    function createVirtualFloor(VirtualFloorCreationParams calldata params) external {
        if (!(msg.sender == params.creator)) revert UnauthorizedMsgSender();
        PROTOCOL.createVirtualFloor(params);
    }

    function commitToVirtualFloor(uint256 vfId, uint8[] memory outcomeIndexes, uint256[] memory amounts, uint256 optionalDeadline) external {
        PROTOCOL.commitToVirtualFloor(vfId, msg.sender, outcomeIndexes, amounts, optionalDeadline);
    }

    function resolve(uint256 vfId, uint8 winningOutcomeIndex) external {
        address creator = PROTOCOL.getVirtualFloorCreator(vfId);
        if (!(msg.sender == creator)) revert UnauthorizedMsgSender();
        PROTOCOL.resolve(vfId, 1 << winningOutcomeIndex, creator);
    }

    function onVirtualFloorConclusion(uint256 /*vfId*/) external view {
        if (!(msg.sender == address(PROTOCOL))) revert UnauthorizedMsgSender();
    }

    function betaOf(uint256 /*vfId*/, uint8 /*outcomeIndex*/, uint256 /*timestamp*/) external pure returns (UFixed32x6) {
        return UFIXED32X6_ONE;
    }

}
