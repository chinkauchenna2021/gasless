/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ResolutionStateWrapper,
  ResolutionStateWrapperInterface,
} from "../../../../../../artifacts/contracts/dev/mock/enum-wrapper/ResolutionStateWrapper";

const _abi = [
  {
    inputs: [],
    name: "ChallengeCancelled",
    outputs: [
      {
        internalType: "enum ResolutionState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Challenged",
    outputs: [
      {
        internalType: "enum ResolutionState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Complete",
    outputs: [
      {
        internalType: "enum ResolutionState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "None",
    outputs: [
      {
        internalType: "enum ResolutionState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Set",
    outputs: [
      {
        internalType: "enum ResolutionState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060e98061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060505760003560e01c806301b7dcb41460555780632081e91114607057806331234354146077578063391b338914607e578063d26e2de9146085575b600080fd5b605c600481565b60405160679190608c565b60405180910390f35b605c600181565b605c600081565b605c600381565b605c600281565b602081016005831060ad57634e487b7160e01b600052602160045260246000fd5b9190529056fea2646970667358221220c9c74870084d08b1c0b9ecd1d87696c61017281bb9070e23a222a90536a1f6a064736f6c634300080c0033";

type ResolutionStateWrapperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ResolutionStateWrapperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ResolutionStateWrapper__factory extends ContractFactory {
  constructor(...args: ResolutionStateWrapperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ResolutionStateWrapper> {
    return super.deploy(overrides || {}) as Promise<ResolutionStateWrapper>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ResolutionStateWrapper {
    return super.attach(address) as ResolutionStateWrapper;
  }
  override connect(signer: Signer): ResolutionStateWrapper__factory {
    return super.connect(signer) as ResolutionStateWrapper__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ResolutionStateWrapperInterface {
    return new utils.Interface(_abi) as ResolutionStateWrapperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ResolutionStateWrapper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ResolutionStateWrapper;
  }
}
