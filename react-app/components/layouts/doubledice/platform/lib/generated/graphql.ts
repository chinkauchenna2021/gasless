export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};

/**
 * This is just a dummy implementation of the VirtualFloor interface.
 * We use it to force graph-cli to generate a wrapper that holds the fields defined on the interface,
 * so that we can then use it as the superclass of AbstractVf.
 */
export type BaseAbstractVf = VirtualFloor & {
  __typename?: 'BaseAbstractVf';
  allText: Scalars['String'];
  application: Scalars['Bytes'];
  bonusAmount: Scalars['BigDecimal'];
  category: Category;
  creationTxHash: Scalars['Bytes'];
  creationTxTimestamp: Scalars['BigInt'];
  creator: User;
  description: Scalars['String'];
  /** Optional: Only set if VF is cancelled because it was flagged. */
  flaggingReason?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intId: Scalars['BigInt'];
  isListed: Scalars['Boolean'];
  isTest: Scalars['Boolean'];
  nOutcomes: Scalars['Int'];
  optionalMaxCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  optionalMinCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  outcomes: Array<Outcome>;
  paymentToken: PaymentToken;
  protocolFeeRate: Scalars['BigDecimal'];
  /** Optional: Only set if VF has been resolved or cancelled. */
  resolutionOrCancellationTxHash?: Maybe<Scalars['Bytes']>;
  /** Optional: Only set if VF has been resolved or cancelled. */
  resolutionOrCancellationTxTimestamp?: Maybe<Scalars['BigInt']>;
  state: VirtualFloorState;
  subcategory: Subcategory;
  tClose: Scalars['BigInt'];
  tResolve: Scalars['BigInt'];
  title: Scalars['String'];
  totalFeeRate: Scalars['BigDecimal'];
  totalSupply: Scalars['BigDecimal'];
  userVirtualFloors: Array<UserVirtualFloor>;
  /** Optional: Only set if VF is resolved. */
  winnerProfits?: Maybe<Scalars['BigDecimal']>;
  /** Optional: Only set if VF is resolved. */
  winningOutcome?: Maybe<Outcome>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  subcategories: Array<Subcategory>;
  virtualFloors: Array<VirtualFloor>;
};

export type ClassicVirtualFloor = VirtualFloor & {
  __typename?: 'ClassicVirtualFloor';
  allText: Scalars['String'];
  application: Scalars['Bytes'];
  betaOpen: Scalars['BigDecimal'];
  bonusAmount: Scalars['BigDecimal'];
  category: Category;
  /** Optional: Only set if the result set by the creator has been challenged */
  challenger?: Maybe<User>;
  creationTxHash: Scalars['Bytes'];
  creationTxTimestamp: Scalars['BigInt'];
  creator: User;
  description: Scalars['String'];
  discordChannelId: Scalars['String'];
  /** Optional: Only set if VF is cancelled because it was flagged. */
  flaggingReason?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intId: Scalars['BigInt'];
  isListed: Scalars['Boolean'];
  isTest: Scalars['Boolean'];
  nOutcomes: Scalars['Int'];
  opponents: Array<Opponent>;
  optionalMaxCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  optionalMinCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  outcomes: Array<Outcome>;
  paymentToken: PaymentToken;
  protocolFeeRate: Scalars['BigDecimal'];
  /** Optional: Only set if VF has been resolved or cancelled. */
  resolutionOrCancellationTxHash?: Maybe<Scalars['Bytes']>;
  /** Optional: Only set if VF has been resolved or cancelled. */
  resolutionOrCancellationTxTimestamp?: Maybe<Scalars['BigInt']>;
  resultSources: Array<ResultSource>;
  /** Optional: Only set if VF result has been every set by anyone. */
  resultUpdateAction?: Maybe<ResultUpdateAction>;
  state: VirtualFloorState;
  subcategory: Subcategory;
  tClose: Scalars['BigInt'];
  tOpen: Scalars['BigInt'];
  tResolve: Scalars['BigInt'];
  /** Optional: Only set once CHALLENGE_WINDOW starts ticking. */
  tResultChallengeMax?: Maybe<Scalars['BigInt']>;
  /** Optional: Only set once SET_WINDOW starts ticking. */
  tResultSetMax: Scalars['BigInt'];
  /**
   * In current ChallengeableCreatorOracle resolution implementation, this may seem redundant as it is always equal to `tResolve`.
   * However this might not hold for alternative resolution implementations.
   * `tResolve` is a core property of the VF, whereas `tResultSetMin` is specific to `ChallengeableCreatorOracle`.
   */
  tResultSetMin: Scalars['BigInt'];
  title: Scalars['String'];
  totalFeeRate: Scalars['BigDecimal'];
  totalSupply: Scalars['BigDecimal'];
  userVirtualFloors: Array<UserVirtualFloor>;
  /**
   * Total commitments to all outcomes + bonus amount - fees.
   * Optional: Only set if VF is resolved.
   */
  winnerProfits?: Maybe<Scalars['BigDecimal']>;
  /** Optional: Only set if VF is resolved. */
  winningOutcome?: Maybe<Outcome>;
};

export type Opponent = {
  __typename?: 'Opponent';
  id: Scalars['ID'];
  image: Scalars['String'];
  title: Scalars['String'];
  virtualFloor: ClassicVirtualFloor;
};

export type Outcome = {
  __typename?: 'Outcome';
  id: Scalars['ID'];
  index: Scalars['Int'];
  outcomeTimeslots: Array<OutcomeTimeslot>;
  title: Scalars['String'];
  /** Total amount over all commitments to this VF outcome. */
  totalSupply: Scalars['BigDecimal'];
  /** Total amount×beta over all commitments to this VF outcome. */
  totalWeightedSupply: Scalars['BigDecimal'];
  userOutcomeTimeslots: Array<UserOutcomeTimeslot>;
  userOutcomes: Array<UserOutcome>;
  virtualFloor: VirtualFloor;
};

/**
 * Groups commitments to a specific VF outcome that were made at a specific timeslot.
 * Every OutcomeTimeslot has a unique ERC-1155 token-id on the DD contract.
 */
export type OutcomeTimeslot = {
  __typename?: 'OutcomeTimeslot';
  beta: Scalars['BigDecimal'];
  id: Scalars['ID'];
  outcome: Outcome;
  outcomeTimeslotTransfers: Array<OutcomeTimeslotTransfer>;
  tokenId: Scalars['BigInt'];
  totalSupply: Scalars['BigDecimal'];
  userOutcomeTimeslots: Array<UserOutcomeTimeslot>;
};

/**
 * Represents a specific ERC-1155 TransferSingle event, incluing mints and burns.
 * TransferBatch events are treated as a sequence of TransferSingle events.
 */
export type OutcomeTimeslotTransfer = {
  __typename?: 'OutcomeTimeslotTransfer';
  amount: Scalars['BigDecimal'];
  from: User;
  id: Scalars['ID'];
  outcomeTimeslot: OutcomeTimeslot;
  to: User;
  txHash: Scalars['Bytes'];
  txTimestamp: Scalars['BigInt'];
};

/** ERC-20 token used as VF payment-tokens. */
export type PaymentToken = {
  __typename?: 'PaymentToken';
  address: Scalars['Bytes'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  isTest: Scalars['Boolean'];
  isWhitelisted: Scalars['Boolean'];
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type ProtocolVirtualFloorCreationEventEntity = {
  __typename?: 'ProtocolVirtualFloorCreationEventEntity';
  block_timestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  params_application: Scalars['Bytes'];
  params_bonusAmount: Scalars['BigInt'];
  params_creator: Scalars['Bytes'];
  params_maxCommitmentAmount: Scalars['BigInt'];
  params_minCommitmentAmount: Scalars['BigInt'];
  params_nOutcomes: Scalars['Int'];
  params_paymentToken: Scalars['Bytes'];
  params_protocolFeeRate_e18: Scalars['BigInt'];
  params_tClose: Scalars['BigInt'];
  params_tOpen: Scalars['BigInt'];
  params_tResolve: Scalars['BigInt'];
  params_totalFeeRate_e18: Scalars['BigInt'];
  params_vfId: Scalars['BigInt'];
  transaction_hash: Scalars['Bytes'];
};

export type RandomVirtualFloor = VirtualFloor & {
  __typename?: 'RandomVirtualFloor';
  allText: Scalars['String'];
  application: Scalars['Bytes'];
  bonusAmount: Scalars['BigDecimal'];
  category: Category;
  creationTxHash: Scalars['Bytes'];
  creationTxTimestamp: Scalars['BigInt'];
  creator: User;
  description: Scalars['String'];
  flaggingReason?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intId: Scalars['BigInt'];
  isListed: Scalars['Boolean'];
  isTest: Scalars['Boolean'];
  nOutcomes: Scalars['Int'];
  optionalMaxCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  optionalMinCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  outcomes: Array<Outcome>;
  paymentToken: PaymentToken;
  protocolFeeRate: Scalars['BigDecimal'];
  /** Has no real significance, just a dummy field to demonstrate an app-specific value. */
  randomNumber: Scalars['BigInt'];
  resolutionOrCancellationTxHash?: Maybe<Scalars['Bytes']>;
  resolutionOrCancellationTxTimestamp?: Maybe<Scalars['BigInt']>;
  state: VirtualFloorState;
  subcategory: Subcategory;
  tClose: Scalars['BigInt'];
  tResolve: Scalars['BigInt'];
  title: Scalars['String'];
  totalFeeRate: Scalars['BigDecimal'];
  totalSupply: Scalars['BigDecimal'];
  userVirtualFloors: Array<UserVirtualFloor>;
  winnerProfits?: Maybe<Scalars['BigDecimal']>;
  winningOutcome?: Maybe<Outcome>;
};

export type ResultSource = {
  __typename?: 'ResultSource';
  id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
  virtualFloor: ClassicVirtualFloor;
};

export enum ResultUpdateAction {
  AdminFinalizedChallenge = 'AdminFinalizedChallenge',
  AdminFinalizedUnsetResult = 'AdminFinalizedUnsetResult',
  CreatorSetResult = 'CreatorSetResult',
  SomeoneChallengedSetResult = 'SomeoneChallengedSetResult',
  SomeoneConfirmedUnchallengedResult = 'SomeoneConfirmedUnchallengedResult'
}

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  roleUsers: Array<RoleUser>;
};

export type RoleUser = {
  __typename?: 'RoleUser';
  id: Scalars['ID'];
  role: Role;
  user: User;
};

export type RouletteSession = {
  __typename?: 'RouletteSession';
  bonusAmounts: Array<Scalars['BigDecimal']>;
  environmentName: Scalars['String'];
  id: Scalars['ID'];
  rouletteVirtualFloors: Array<RouletteVirtualFloor>;
  tOpen: Scalars['BigInt'];
  tResolve: Scalars['BigInt'];
  tableId: Scalars['BigInt'];
  tableName: Scalars['String'];
  vfIds: Array<Scalars['BigInt']>;
};

export type RouletteVirtualFloor = VirtualFloor & {
  __typename?: 'RouletteVirtualFloor';
  allText: Scalars['String'];
  application: Scalars['Bytes'];
  bonusAmount: Scalars['BigDecimal'];
  category: Category;
  creationTxHash: Scalars['Bytes'];
  creationTxTimestamp: Scalars['BigInt'];
  creator: User;
  description: Scalars['String'];
  environmentName: Scalars['String'];
  flaggingReason?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intId: Scalars['BigInt'];
  isListed: Scalars['Boolean'];
  isTest: Scalars['Boolean'];
  nOutcomes: Scalars['Int'];
  optionalMaxCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  optionalMinCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  outcomes: Array<Outcome>;
  paymentToken: PaymentToken;
  protocolFeeRate: Scalars['BigDecimal'];
  resolutionOrCancellationTxHash?: Maybe<Scalars['Bytes']>;
  resolutionOrCancellationTxTimestamp?: Maybe<Scalars['BigInt']>;
  session: RouletteSession;
  state: VirtualFloorState;
  subcategory: Subcategory;
  tClose: Scalars['BigInt'];
  tOpen: Scalars['BigInt'];
  tResolve: Scalars['BigInt'];
  tableId: Scalars['BigInt'];
  tableName: Scalars['String'];
  title: Scalars['String'];
  totalFeeRate: Scalars['BigDecimal'];
  totalSupply: Scalars['BigDecimal'];
  userVirtualFloors: Array<UserVirtualFloor>;
  winnerProfits?: Maybe<Scalars['BigDecimal']>;
  winningOutcome?: Maybe<Outcome>;
};

export type Subcategory = {
  __typename?: 'Subcategory';
  category: Category;
  /**
   * Unique across all categories.
   * Currently formed by combining `subcategory.category.id + '/' + subcategory.subid`,
   * but this could change, so frontend code should treat this as an opaque string.
   */
  id: Scalars['ID'];
  /** Unique only within the parent category. */
  subid: Scalars['String'];
  virtualFloors: Array<VirtualFloor>;
};

export type User = {
  __typename?: 'User';
  challengedVirtualFloors: Array<ClassicVirtualFloor>;
  concurrentVirtualFloors: Scalars['BigInt'];
  createdVirtualFloors: Array<VirtualFloor>;
  id: Scalars['ID'];
  maxConcurrentVirtualFloors: Scalars['BigInt'];
  outcomeTimeslotTransfersFrom: Array<OutcomeTimeslotTransfer>;
  outcomeTimeslotTransfersTo: Array<OutcomeTimeslotTransfer>;
  roleUsers: Array<RoleUser>;
  userOutcomeTimeslots: Array<UserOutcomeTimeslot>;
  userOutcomes: Array<UserOutcome>;
  userVirtualFloors: Array<UserVirtualFloor>;
};

export type UserOutcome = {
  __typename?: 'UserOutcome';
  id: Scalars['ID'];
  outcome: Outcome;
  /** Mirrors on-chain ERC-1155 balance of this `User` summed over all `OutcomeTimeslot`s under this `Outcome`. */
  totalBalance: Scalars['BigDecimal'];
  totalBalancePlusTotalClaimedBalance: Scalars['BigDecimal'];
  totalClaimedBalance: Scalars['BigDecimal'];
  totalWeightedBalance: Scalars['BigDecimal'];
  user: User;
  userOutcomeTimeslots: Array<UserOutcomeTimeslot>;
  userVirtualFloor: UserVirtualFloor;
};

/**
 * Groups commitments to a specific VF outcome that were made at a specific timeslot, for a specific user.
 * Synonymous to the specific user’s ERC-1155 balance on the parent `OutcomeTimeslot`.
 */
export type UserOutcomeTimeslot = {
  __typename?: 'UserOutcomeTimeslot';
  /** Mirrors on-chain ERC-1155 balance of this `User` on this `OutcomeTimeslot`. */
  balance: Scalars['BigDecimal'];
  /**
   * This will always be updated to be `= balance + claimedBalance`.
   * Since we cannot query Graph for entities that have balance_gt: 0 OR claimedBalance_gt: 0,
   * we work around it by quering for balancePlusClaimedBalance_gt: 0
   */
  balancePlusClaimedBalance: Scalars['BigDecimal'];
  claimedBalance: Scalars['BigDecimal'];
  id: Scalars['ID'];
  outcome: Outcome;
  outcomeTimeslot: OutcomeTimeslot;
  user: User;
  userOutcome: UserOutcome;
};

/**
 * The user’s holdings on the VF.
 * Once the user claims payouts or refunds, the corresponding balances still remain under the Vf
 * and other the VfOutcome, but are transferred to `0x0000000000000000000000000000000000000000`.
 */
export type UserVirtualFloor = {
  __typename?: 'UserVirtualFloor';
  id: Scalars['ID'];
  /** Mirrors on-chain ERC-1155 balance of this `User` summed over all `OutcomeTimeslot`s under all `Outcome`s under this VF. */
  totalBalance: Scalars['BigDecimal'];
  totalBalancePlusTotalClaimedBalance: Scalars['BigDecimal'];
  totalClaimedBalance: Scalars['BigDecimal'];
  user: User;
  userOutcomes: Array<UserOutcome>;
  virtualFloor: VirtualFloor;
};

/** Abstracts the fields common to different VF types. */
export type VirtualFloor = {
  allText: Scalars['String'];
  application: Scalars['Bytes'];
  bonusAmount: Scalars['BigDecimal'];
  category: Category;
  creationTxHash: Scalars['Bytes'];
  creationTxTimestamp: Scalars['BigInt'];
  creator: User;
  description: Scalars['String'];
  /** Optional: Only set if VF is cancelled because it was flagged. */
  flaggingReason?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  intId: Scalars['BigInt'];
  isListed: Scalars['Boolean'];
  isTest: Scalars['Boolean'];
  nOutcomes: Scalars['Int'];
  optionalMaxCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  optionalMinCommitmentAmount?: Maybe<Scalars['BigDecimal']>;
  outcomes: Array<Outcome>;
  paymentToken: PaymentToken;
  protocolFeeRate: Scalars['BigDecimal'];
  /** Optional: Only set if VF has been resolved or cancelled. */
  resolutionOrCancellationTxHash?: Maybe<Scalars['Bytes']>;
  /** Optional: Only set if VF has been resolved or cancelled. */
  resolutionOrCancellationTxTimestamp?: Maybe<Scalars['BigInt']>;
  state: VirtualFloorState;
  subcategory: Subcategory;
  tClose: Scalars['BigInt'];
  tResolve: Scalars['BigInt'];
  title: Scalars['String'];
  totalFeeRate: Scalars['BigDecimal'];
  totalSupply: Scalars['BigDecimal'];
  userVirtualFloors: Array<UserVirtualFloor>;
  /** Optional: Only set if VF is resolved. */
  winnerProfits?: Maybe<Scalars['BigDecimal']>;
  /** Optional: Only set if VF is resolved. */
  winningOutcome?: Maybe<Outcome>;
};

export enum VirtualFloorState {
  Active_ResultChallenged = 'Active_ResultChallenged',
  Active_ResultNone = 'Active_ResultNone',
  Active_ResultSet = 'Active_ResultSet',
  Claimable_Payouts = 'Claimable_Payouts',
  Claimable_Refunds_Flagged = 'Claimable_Refunds_Flagged',
  Claimable_Refunds_ResolvableNever = 'Claimable_Refunds_ResolvableNever',
  Claimable_Refunds_ResolvedNoWinners = 'Claimable_Refunds_ResolvedNoWinners'
}

/**
 * Holds totals in a singleton entity with special id 'singleton'.
 *
 * Like a database table with a single row.
 */
export type VirtualFloorsAggregate = {
  __typename?: 'VirtualFloorsAggregate';
  /** Should be always 'singleton' */
  id: Scalars['ID'];
  /** The total number of VFs ever created. */
  totalVirtualFloorsCreated: Scalars['Int'];
};
