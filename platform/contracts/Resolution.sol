// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

enum ResolutionState {
    None,
    Set,
    Challenged,
    ChallengeCancelled,
    Complete
}

struct Resolution {
    ResolutionState state;
    uint8 setOutcomeIndex;
    uint32 tResultChallengeMax;
    uint8 challengeOutcomeIndex;
    address challenger;
}
