/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  VirtualFloorCreationParamsUtils,
  VirtualFloorCreationParamsUtilsInterface,
} from "../../../../artifacts/contracts/library/VirtualFloorCreationParamsUtils";

const _abi = [
  {
    inputs: [],
    name: "BetaOpenTooSmall",
    type: "error",
  },
  {
    inputs: [],
    name: "CreationFeeRateTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTimeline",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidVirtualFloorId",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughOutcomes",
    type: "error",
  },
];

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220fb87579e2f2e5a38d8c88a9d1bd8820ba362f4553f5284fd0f6008d3011eec7164736f6c634300080c0033";

type VirtualFloorCreationParamsUtilsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VirtualFloorCreationParamsUtilsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VirtualFloorCreationParamsUtils__factory extends ContractFactory {
  constructor(...args: VirtualFloorCreationParamsUtilsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VirtualFloorCreationParamsUtils> {
    return super.deploy(
      overrides || {}
    ) as Promise<VirtualFloorCreationParamsUtils>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): VirtualFloorCreationParamsUtils {
    return super.attach(address) as VirtualFloorCreationParamsUtils;
  }
  override connect(signer: Signer): VirtualFloorCreationParamsUtils__factory {
    return super.connect(signer) as VirtualFloorCreationParamsUtils__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VirtualFloorCreationParamsUtilsInterface {
    return new utils.Interface(
      _abi
    ) as VirtualFloorCreationParamsUtilsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VirtualFloorCreationParamsUtils {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as VirtualFloorCreationParamsUtils;
  }
}
