/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../../common";

export type ChainlinkConfigStruct = {
  vrfCoordinator: string;
  keyHash: BytesLike;
  subId: BigNumberish;
  minRequestConfirmations: BigNumberish;
  callbackGasLimit: BigNumberish;
  linkToken: string;
};

export type ChainlinkConfigStructOutput = [
  string,
  string,
  BigNumber,
  number,
  number,
  string
] & {
  vrfCoordinator: string;
  keyHash: string;
  subId: BigNumber;
  minRequestConfirmations: number;
  callbackGasLimit: number;
  linkToken: string;
};

export type EncodedVirtualFloorMetadataStruct = {
  version: BytesLike;
  data: BytesLike;
};

export type EncodedVirtualFloorMetadataStructOutput = [string, string] & {
  version: string;
  data: string;
};

export type RouletteSessionCreationParamsStruct = {
  vfIds: BigNumberish[];
  totalFeeRate_e18: BigNumberish;
  paymentToken: string;
  tOpen: BigNumberish;
  tResolve: BigNumberish;
  nOutcomes: BigNumberish;
  bonusAmounts: BigNumberish[];
  optionalMinCommitmentAmount: BigNumberish;
  optionalMaxCommitmentAmount: BigNumberish;
  metadata: EncodedVirtualFloorMetadataStruct;
};

export type RouletteSessionCreationParamsStructOutput = [
  BigNumber[],
  BigNumber,
  string,
  number,
  number,
  number,
  BigNumber[],
  BigNumber,
  BigNumber,
  EncodedVirtualFloorMetadataStructOutput
] & {
  vfIds: BigNumber[];
  totalFeeRate_e18: BigNumber;
  paymentToken: string;
  tOpen: number;
  tResolve: number;
  nOutcomes: number;
  bonusAmounts: BigNumber[];
  optionalMinCommitmentAmount: BigNumber;
  optionalMaxCommitmentAmount: BigNumber;
  metadata: EncodedVirtualFloorMetadataStructOutput;
};

export interface RouletteDoubleDiceAppInterface extends utils.Interface {
  functions: {
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "OPERATOR_ROLE()": FunctionFragment;
    "PROTOCOL()": FunctionFragment;
    "betaOf(uint256,uint8,uint256)": FunctionFragment;
    "commitToVirtualFloor(uint256,uint8[],uint256[],uint256)": FunctionFragment;
    "createRouletteSession((uint256[],uint256,address,uint32,uint32,uint8,uint256[],uint256,uint256,(bytes32,bytes)))": FunctionFragment;
    "getCoordinator()": FunctionFragment;
    "getCurrentTableId()": FunctionFragment;
    "getKeyHash()": FunctionFragment;
    "getRngFee()": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "getSubscriptionId()": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "initialize()": FunctionFragment;
    "isTrustedForwarder(address)": FunctionFragment;
    "onVirtualFloorConclusion(uint256)": FunctionFragment;
    "paused()": FunctionFragment;
    "rawFulfillRandomWords(uint256,uint256[])": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "resolveVirtualFloor(uint256)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "rngFee()": FunctionFragment;
    "setRngFee(uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "vfIdsByRequestId(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "DEFAULT_ADMIN_ROLE"
      | "OPERATOR_ROLE"
      | "PROTOCOL"
      | "betaOf"
      | "commitToVirtualFloor"
      | "createRouletteSession"
      | "getCoordinator"
      | "getCurrentTableId"
      | "getKeyHash"
      | "getRngFee"
      | "getRoleAdmin"
      | "getSubscriptionId"
      | "grantRole"
      | "hasRole"
      | "initialize"
      | "isTrustedForwarder"
      | "onVirtualFloorConclusion"
      | "paused"
      | "rawFulfillRandomWords"
      | "renounceRole"
      | "resolveVirtualFloor"
      | "revokeRole"
      | "rngFee"
      | "setRngFee"
      | "supportsInterface"
      | "vfIdsByRequestId"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "OPERATOR_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "PROTOCOL", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "betaOf",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "commitToVirtualFloor",
    values: [BigNumberish, BigNumberish[], BigNumberish[], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createRouletteSession",
    values: [RouletteSessionCreationParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getCoordinator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentTableId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getKeyHash",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getRngFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getSubscriptionId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "onVirtualFloorConclusion",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rawFulfillRandomWords",
    values: [BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "resolveVirtualFloor",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "rngFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setRngFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "vfIdsByRequestId",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "OPERATOR_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "PROTOCOL", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "betaOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "commitToVirtualFloor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createRouletteSession",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCoordinator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentTableId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getKeyHash", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRngFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubscriptionId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onVirtualFloorConclusion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rawFulfillRandomWords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "resolveVirtualFloor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rngFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setRngFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "vfIdsByRequestId",
    data: BytesLike
  ): Result;

  events: {
    "Paused(address)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "RouletteSessionCreation(uint256,uint256[],uint256[],uint32,uint32,tuple)": EventFragment;
    "Unpaused(address)": EventFragment;
    "VirtualFloorResolution(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RouletteSessionCreation"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VirtualFloorResolution"): EventFragment;
}

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface RoleAdminChangedEventObject {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}
export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  RoleAdminChangedEventObject
>;

export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;

export interface RoleGrantedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  RoleGrantedEventObject
>;

export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;

export interface RoleRevokedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  RoleRevokedEventObject
>;

export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;

export interface RouletteSessionCreationEventObject {
  tableId: BigNumber;
  vfIds: BigNumber[];
  bonusAmounts: BigNumber[];
  tOpen: number;
  tResolve: number;
  metadata: EncodedVirtualFloorMetadataStructOutput;
}
export type RouletteSessionCreationEvent = TypedEvent<
  [
    BigNumber,
    BigNumber[],
    BigNumber[],
    number,
    number,
    EncodedVirtualFloorMetadataStructOutput
  ],
  RouletteSessionCreationEventObject
>;

export type RouletteSessionCreationEventFilter =
  TypedEventFilter<RouletteSessionCreationEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface VirtualFloorResolutionEventObject {
  vfId: BigNumber;
  requestId: BigNumber;
}
export type VirtualFloorResolutionEvent = TypedEvent<
  [BigNumber, BigNumber],
  VirtualFloorResolutionEventObject
>;

export type VirtualFloorResolutionEventFilter =
  TypedEventFilter<VirtualFloorResolutionEvent>;

export interface RouletteDoubleDiceApp extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RouletteDoubleDiceAppInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<[string]>;

    PROTOCOL(overrides?: CallOverrides): Promise<[string]>;

    betaOf(
      arg0: BigNumberish,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number]>;

    commitToVirtualFloor(
      vfId: BigNumberish,
      outcomeIndexes: BigNumberish[],
      amounts: BigNumberish[],
      optionalDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createRouletteSession(
      sessionParams: RouletteSessionCreationParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getCoordinator(overrides?: CallOverrides): Promise<[string]>;

    getCurrentTableId(overrides?: CallOverrides): Promise<[BigNumber]>;

    getKeyHash(overrides?: CallOverrides): Promise<[string]>;

    getRngFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    getSubscriptionId(overrides?: CallOverrides): Promise<[BigNumber]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    onVirtualFloorConclusion(
      vfId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    resolveVirtualFloor(
      vfId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rngFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    setRngFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    vfIdsByRequestId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  OPERATOR_ROLE(overrides?: CallOverrides): Promise<string>;

  PROTOCOL(overrides?: CallOverrides): Promise<string>;

  betaOf(
    arg0: BigNumberish,
    arg1: BigNumberish,
    arg2: BigNumberish,
    overrides?: CallOverrides
  ): Promise<number>;

  commitToVirtualFloor(
    vfId: BigNumberish,
    outcomeIndexes: BigNumberish[],
    amounts: BigNumberish[],
    optionalDeadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createRouletteSession(
    sessionParams: RouletteSessionCreationParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getCoordinator(overrides?: CallOverrides): Promise<string>;

  getCurrentTableId(overrides?: CallOverrides): Promise<BigNumber>;

  getKeyHash(overrides?: CallOverrides): Promise<string>;

  getRngFee(overrides?: CallOverrides): Promise<BigNumber>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  getSubscriptionId(overrides?: CallOverrides): Promise<BigNumber>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  initialize(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isTrustedForwarder(
    forwarder: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  onVirtualFloorConclusion(
    vfId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  rawFulfillRandomWords(
    requestId: BigNumberish,
    randomWords: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  resolveVirtualFloor(
    vfId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rngFee(overrides?: CallOverrides): Promise<BigNumber>;

  setRngFee(
    fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  vfIdsByRequestId(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<string>;

    PROTOCOL(overrides?: CallOverrides): Promise<string>;

    betaOf(
      arg0: BigNumberish,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<number>;

    commitToVirtualFloor(
      vfId: BigNumberish,
      outcomeIndexes: BigNumberish[],
      amounts: BigNumberish[],
      optionalDeadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    createRouletteSession(
      sessionParams: RouletteSessionCreationParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getCoordinator(overrides?: CallOverrides): Promise<string>;

    getCurrentTableId(overrides?: CallOverrides): Promise<BigNumber>;

    getKeyHash(overrides?: CallOverrides): Promise<string>;

    getRngFee(overrides?: CallOverrides): Promise<BigNumber>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    getSubscriptionId(overrides?: CallOverrides): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initialize(overrides?: CallOverrides): Promise<void>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    onVirtualFloorConclusion(
      vfId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    resolveVirtualFloor(
      vfId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    rngFee(overrides?: CallOverrides): Promise<BigNumber>;

    setRngFee(fee: BigNumberish, overrides?: CallOverrides): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    vfIdsByRequestId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): RoleAdminChangedEventFilter;

    "RoleGranted(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleGrantedEventFilter;

    "RoleRevoked(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleRevokedEventFilter;

    "RouletteSessionCreation(uint256,uint256[],uint256[],uint32,uint32,tuple)"(
      tableId?: BigNumberish | null,
      vfIds?: null,
      bonusAmounts?: null,
      tOpen?: null,
      tResolve?: null,
      metadata?: null
    ): RouletteSessionCreationEventFilter;
    RouletteSessionCreation(
      tableId?: BigNumberish | null,
      vfIds?: null,
      bonusAmounts?: null,
      tOpen?: null,
      tResolve?: null,
      metadata?: null
    ): RouletteSessionCreationEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    "VirtualFloorResolution(uint256,uint256)"(
      vfId?: BigNumberish | null,
      requestId?: null
    ): VirtualFloorResolutionEventFilter;
    VirtualFloorResolution(
      vfId?: BigNumberish | null,
      requestId?: null
    ): VirtualFloorResolutionEventFilter;
  };

  estimateGas: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    PROTOCOL(overrides?: CallOverrides): Promise<BigNumber>;

    betaOf(
      arg0: BigNumberish,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    commitToVirtualFloor(
      vfId: BigNumberish,
      outcomeIndexes: BigNumberish[],
      amounts: BigNumberish[],
      optionalDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createRouletteSession(
      sessionParams: RouletteSessionCreationParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getCoordinator(overrides?: CallOverrides): Promise<BigNumber>;

    getCurrentTableId(overrides?: CallOverrides): Promise<BigNumber>;

    getKeyHash(overrides?: CallOverrides): Promise<BigNumber>;

    getRngFee(overrides?: CallOverrides): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSubscriptionId(overrides?: CallOverrides): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    onVirtualFloorConclusion(
      vfId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    resolveVirtualFloor(
      vfId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rngFee(overrides?: CallOverrides): Promise<BigNumber>;

    setRngFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    vfIdsByRequestId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PROTOCOL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    betaOf(
      arg0: BigNumberish,
      arg1: BigNumberish,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    commitToVirtualFloor(
      vfId: BigNumberish,
      outcomeIndexes: BigNumberish[],
      amounts: BigNumberish[],
      optionalDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createRouletteSession(
      sessionParams: RouletteSessionCreationParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getCoordinator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCurrentTableId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getKeyHash(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRngFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSubscriptionId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    onVirtualFloorConclusion(
      vfId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rawFulfillRandomWords(
      requestId: BigNumberish,
      randomWords: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    resolveVirtualFloor(
      vfId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rngFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setRngFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    vfIdsByRequestId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}