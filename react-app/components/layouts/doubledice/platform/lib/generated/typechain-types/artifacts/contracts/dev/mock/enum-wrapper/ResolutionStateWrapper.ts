/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../../../common";

export interface ResolutionStateWrapperInterface extends utils.Interface {
  functions: {
    "ChallengeCancelled()": FunctionFragment;
    "Challenged()": FunctionFragment;
    "Complete()": FunctionFragment;
    "None()": FunctionFragment;
    "Set()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ChallengeCancelled"
      | "Challenged"
      | "Complete"
      | "None"
      | "Set"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ChallengeCancelled",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "Challenged",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "Complete", values?: undefined): string;
  encodeFunctionData(functionFragment: "None", values?: undefined): string;
  encodeFunctionData(functionFragment: "Set", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "ChallengeCancelled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "Challenged", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "Complete", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "None", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "Set", data: BytesLike): Result;

  events: {};
}

export interface ResolutionStateWrapper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ResolutionStateWrapperInterface;

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
    ChallengeCancelled(overrides?: CallOverrides): Promise<[number]>;

    Challenged(overrides?: CallOverrides): Promise<[number]>;

    Complete(overrides?: CallOverrides): Promise<[number]>;

    None(overrides?: CallOverrides): Promise<[number]>;

    Set(overrides?: CallOverrides): Promise<[number]>;
  };

  ChallengeCancelled(overrides?: CallOverrides): Promise<number>;

  Challenged(overrides?: CallOverrides): Promise<number>;

  Complete(overrides?: CallOverrides): Promise<number>;

  None(overrides?: CallOverrides): Promise<number>;

  Set(overrides?: CallOverrides): Promise<number>;

  callStatic: {
    ChallengeCancelled(overrides?: CallOverrides): Promise<number>;

    Challenged(overrides?: CallOverrides): Promise<number>;

    Complete(overrides?: CallOverrides): Promise<number>;

    None(overrides?: CallOverrides): Promise<number>;

    Set(overrides?: CallOverrides): Promise<number>;
  };

  filters: {};

  estimateGas: {
    ChallengeCancelled(overrides?: CallOverrides): Promise<BigNumber>;

    Challenged(overrides?: CallOverrides): Promise<BigNumber>;

    Complete(overrides?: CallOverrides): Promise<BigNumber>;

    None(overrides?: CallOverrides): Promise<BigNumber>;

    Set(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    ChallengeCancelled(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    Challenged(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    Complete(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    None(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    Set(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
