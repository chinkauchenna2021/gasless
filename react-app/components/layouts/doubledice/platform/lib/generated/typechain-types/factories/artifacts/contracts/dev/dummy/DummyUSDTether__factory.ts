/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  DummyUSDTether,
  DummyUSDTetherInterface,
} from "../../../../../artifacts/contracts/dev/dummy/DummyUSDTether";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lockTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nextAccessTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "setLockTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526201518060065534801561001757600080fd5b50604080518082018252601281527155534420546574686572202844756d6d792960701b6020808301918252835180850190945260048452631554d11560e21b90840152815191929161006c9160039161009a565b50805161008090600490602084019061009a565b5050600580546001600160a01b031916331790555061016e565b8280546100a690610133565b90600052602060002090601f0160209004810192826100c8576000855561010e565b82601f106100e157805160ff191683800117855561010e565b8280016001018555821561010e579182015b8281111561010e5782518255916020019190600101906100f3565b5061011a92915061011e565b5090565b5b8082111561011a576000815560010161011f565b600181811c9082168061014757607f821691505b6020821081141561016857634e487b7160e01b600052602260045260246000fd5b50919050565b610b7e806200017e6000396000f3fe608060405234801561001057600080fd5b50600436106100e05760003560e01c806340c10f191161008757806340c10f191461018f578063516fad0a146101a457806370a08231146101c457806395d89b41146101ed578063a457c2d7146101f5578063a9059cbb14610208578063ae04d45d1461021b578063dd62ed3e1461022e57600080fd5b806306fdde03146100e5578063095ea7b3146101035780630d6680871461012657806312065fe01461013d57806318160ddd1461015257806323b872dd1461015a578063313ce5671461016d578063395093511461017c575b600080fd5b6100ed610241565b6040516100fa919061097b565b60405180910390f35b6101166101113660046109ec565b6102d3565b60405190151581526020016100fa565b61012f60065481565b6040519081526020016100fa565b3060009081526020819052604090205461012f565b60025461012f565b610116610168366004610a16565b6102eb565b604051600681526020016100fa565b61011661018a3660046109ec565b61030f565b6101a261019d3660046109ec565b610331565b005b61012f6101b2366004610a52565b60076020526000908152604090205481565b61012f6101d2366004610a52565b6001600160a01b031660009081526020819052604090205490565b6100ed610435565b6101166102033660046109ec565b610444565b6101166102163660046109ec565b6104bf565b6101a2610229366004610a74565b6104cd565b61012f61023c366004610a8d565b61054f565b60606003805461025090610ac0565b80601f016020809104026020016040519081016040528092919081815260200182805461027c90610ac0565b80156102c95780601f1061029e576101008083540402835291602001916102c9565b820191906000526020600020905b8154815290600101906020018083116102ac57829003601f168201915b5050505050905090565b6000336102e181858561057a565b5060019392505050565b6000336102f985828561069e565b610304858585610718565b506001949350505050565b6000336102e1818585610322838361054f565b61032c9190610b11565b61057a565b336103735760405162461bcd60e51b815260206004820152600d60248201526c081e995c9bc81858d8dbdd5b9d609a1b60448201526064015b60405180910390fd5b633b9aca008111156103b75760405162461bcd60e51b815260206004820152600d60248201526c0616d6f756e74203c3d3130303609c1b604482015260640161036a565b3360009081526007602052604090205442101561040a5760405162461bcd60e51b815260206004820152601160248201527003a34b6b2903737ba1032b630b839b2b21607d1b604482015260640161036a565b6006546104179042610b11565b3360009081526007602052604090205561043182826108bc565b5050565b60606004805461025090610ac0565b60003381610452828661054f565b9050838110156104b25760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b606482015260840161036a565b610304828686840361057a565b6000336102e1818585610718565b6005546001600160a01b0316331461053e5760405162461bcd60e51b815260206004820152602e60248201527f4f6e6c792074686520636f6e7472616374206f776e65722063616e2063616c6c60448201526d103a3434b990333ab731ba34b7b760911b606482015260840161036a565b61054981603c610b29565b60065550565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166105dc5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161036a565b6001600160a01b03821661063d5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161036a565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60006106aa848461054f565b9050600019811461071257818110156107055760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161036a565b610712848484840361057a565b50505050565b6001600160a01b03831661077c5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161036a565b6001600160a01b0382166107de5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161036a565b6001600160a01b038316600090815260208190526040902054818110156108565760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161036a565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610712565b6001600160a01b0382166109125760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161036a565b80600260008282546109249190610b11565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600060208083528351808285015260005b818110156109a85785810183015185820160400152820161098c565b818111156109ba576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b03811681146109e757600080fd5b919050565b600080604083850312156109ff57600080fd5b610a08836109d0565b946020939093013593505050565b600080600060608486031215610a2b57600080fd5b610a34846109d0565b9250610a42602085016109d0565b9150604084013590509250925092565b600060208284031215610a6457600080fd5b610a6d826109d0565b9392505050565b600060208284031215610a8657600080fd5b5035919050565b60008060408385031215610aa057600080fd5b610aa9836109d0565b9150610ab7602084016109d0565b90509250929050565b600181811c90821680610ad457607f821691505b60208210811415610af557634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115610b2457610b24610afb565b500190565b6000816000190483118215151615610b4357610b43610afb565b50029056fea264697066735822122044366f23a51246c520eb0c4244b1e8a778a7900ae0eec840b90bc2915f4c0ed164736f6c634300080c0033";

type DummyUSDTetherConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DummyUSDTetherConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DummyUSDTether__factory extends ContractFactory {
  constructor(...args: DummyUSDTetherConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DummyUSDTether> {
    return super.deploy(overrides || {}) as Promise<DummyUSDTether>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DummyUSDTether {
    return super.attach(address) as DummyUSDTether;
  }
  override connect(signer: Signer): DummyUSDTether__factory {
    return super.connect(signer) as DummyUSDTether__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DummyUSDTetherInterface {
    return new utils.Interface(_abi) as DummyUSDTetherInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DummyUSDTether {
    return new Contract(address, _abi, signerOrProvider) as DummyUSDTether;
  }
}
