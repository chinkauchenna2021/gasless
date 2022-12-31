// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.12;

import "../../../DoubleDiceProtocol.sol";

contract VirtualFloorResolutionTypeWrapper {
    /* solhint-disable const-name-snakecase */
    DoubleDiceProtocol.VirtualFloorResolutionType constant public NoWinners = DoubleDiceProtocol.VirtualFloorResolutionType.NoWinners;
    DoubleDiceProtocol.VirtualFloorResolutionType constant public Winners = DoubleDiceProtocol.VirtualFloorResolutionType.Winners;
    /* solhint-enable const-name-snakecase */
}
