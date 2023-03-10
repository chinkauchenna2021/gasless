// This file doubles as a TypeScript and as an AssemblyScript file,
// so syntax in this file must be limited to the intersection
// of TypeScript and AssemblyScript.

export enum VirtualFloorResolutionType {
  NoWinners,
  Winners
}

export enum VirtualFloorState {
  None,
  Active_Open_MaybeResolvableNever,    // formerly Running
  Active_Open_ResolvableLater,         // formerly Running
  Active_Closed_ResolvableNever,       // formerly ClosedUnresolvable
  Active_Closed_ResolvableLater,       // formerly ClosedPreResolvable
  Active_Closed_ResolvableNow,         // formerly ClosedResolvable
  Claimable_Payouts,                   // formerly ResolvedWinners
  Claimable_Refunds_ResolvedNoWinners, // formerly CancelledResolvedNoWinners
  Claimable_Refunds_ResolvableNever,   // formerly CancelledUnresolvable
  Claimable_Refunds_Flagged            // formerly CancelledFlagged
}

export enum ResultUpdateAction {
  OperatorFinalizedUnsetResult,
  CreatorSetResult,
  SomeoneConfirmedUnchallengedResult,
  SomeoneChallengedSetResult,
  OperatorFinalizedChallenge
}

export enum ResolutionState {
  None,
  Set,
  Challenged,
  ChallengeCancelled,
  Complete
}
