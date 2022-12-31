// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.12;

import "../../../Resolution.sol";

contract ResolutionStateWrapper {
    /* solhint-disable const-name-snakecase */
    ResolutionState constant public None = ResolutionState.None;
    ResolutionState constant public Set = ResolutionState.Set;
    ResolutionState constant public Challenged = ResolutionState.Challenged;
    ResolutionState constant public ChallengeCancelled = ResolutionState.ChallengeCancelled;
    ResolutionState constant public Complete = ResolutionState.Complete;
    /* solhint-enable const-name-snakecase */
}
