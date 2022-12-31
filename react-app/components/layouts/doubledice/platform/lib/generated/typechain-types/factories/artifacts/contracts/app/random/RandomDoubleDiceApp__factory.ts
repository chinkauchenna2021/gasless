/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RandomDoubleDiceApp,
  RandomDoubleDiceAppInterface,
  ChainlinkConfigStruct,
} from "../../../../../artifacts/contracts/app/random/RandomDoubleDiceApp";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract DoubleDiceProtocol",
        name: "protocol",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "vrfCoordinator",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "keyHash",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "subId",
            type: "uint64",
          },
          {
            internalType: "uint16",
            name: "minRequestConfirmations",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "callbackGasLimit",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "linkToken",
            type: "address",
          },
        ],
        internalType: "struct ChainlinkConfig",
        name: "chainlinkConfig",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidRandomWords",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidVFId",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "have",
        type: "address",
      },
      {
        internalType: "address",
        name: "want",
        type: "address",
      },
    ],
    name: "OnlyCoordinatorCanFulfill",
    type: "error",
  },
  {
    inputs: [],
    name: "RequestIdAlreadyExist",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroRequestId",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "vfId",
        type: "uint256",
      },
    ],
    name: "VirtualFloorCreation",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPERATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROTOCOL",
    outputs: [
      {
        internalType: "contract DoubleDiceProtocol",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "betaOf",
    outputs: [
      {
        internalType: "UFixed32x6",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "vfId",
        type: "uint256",
      },
      {
        internalType: "uint8[]",
        name: "outcomeIndexes",
        type: "uint8[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "commitToVirtualFloor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "vfId",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "tResolve",
        type: "uint32",
      },
      {
        internalType: "contract IERC20Upgradeable",
        name: "paymentToken",
        type: "address",
      },
    ],
    name: "createVirtualFloor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCoordinator",
    outputs: [
      {
        internalType: "contract VRFCoordinatorV2Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getKeyHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRngFee",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSubscriptionId",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "vfId",
        type: "uint256",
      },
    ],
    name: "onVirtualFloorConclusion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "randomWords",
        type: "uint256[]",
      },
    ],
    name: "rawFulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "vfId",
        type: "uint256",
      },
    ],
    name: "resolve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rngFee",
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
        name: "fee",
        type: "uint256",
      },
    ],
    name: "setRngFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "vfIdsByRequestId",
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
];

const _bytecode =
  "0x610180604052600060fb553480156200001757600080fd5b50604051620018fc380380620018fc8339810160408190526200003a91620001fe565b80516001600160a01b03908116608090815283821660a09081528351831660c052602084015161010090815260408501516001600160401b031661012052606085015161ffff16610140529184015163ffffffff166101605283015190911660e0526000540460ff16620000b55760005460ff1615620000bf565b620000bf62000166565b620001275760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff161580156200014a576000805461ffff19166101011790555b80156200015d576000805461ff00191690555b505050620002db565b60006200017e306200018460201b620008d91760201c565b15905090565b6001600160a01b03163b151590565b6001600160a01b0381168114620001a957600080fd5b50565b8051620001b98162000193565b919050565b80516001600160401b0381168114620001b957600080fd5b805161ffff81168114620001b957600080fd5b805163ffffffff81168114620001b957600080fd5b60008082840360e08112156200021357600080fd5b8351620002208162000193565b925060c0601f19820112156200023557600080fd5b5060405160c081016001600160401b03811182821017156200026757634e487b7160e01b600052604160045260246000fd5b6040526200027860208501620001ac565b8152604084015160208201526200029260608501620001be565b6040820152620002a560808501620001d6565b6060820152620002b860a08501620001e9565b6080820152620002cb60c08501620001ac565b60a0820152809150509250929050565b60805160a05160c05160e05161010051610120516101405161016051611586620003766000396000610c3701526000610c0b0152600081816103510152610be10152600081816102000152610bb2015260005050600081816102770152610c730152600081816102e0015281816104ce01528181610804015281816109840152610a21015260008181610412015261045401526115866000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c806371977fe0116100c3578063a217fddf1161007c578063a217fddf14610315578063d353bced1461031d578063d547741f14610330578063de3d9fb714610343578063e92f306c1461037b578063f5b541a6146103a957600080fd5b806371977fe01461027557806372fac5a8146102af5780638129fc1c146102c25780638174e7f8146102ca57806391b9b827146102db57806391d148541461030257600080fd5b806331329c9c1161011557806331329c9c146101eb578063331bf125146101fe57806336568abe146102245780634f896d4f146102375780635c975abb1461024a57806365ff6e601461025557600080fd5b806301ffc9a71461015d5780631adb2e17146101855780631fe543e314610197578063248a9ca3146101ac578063254a5d17146101cf5780632f2ff15d146101d8575b600080fd5b61017061016b366004610f0c565b6103d0565b60405190151581526020015b60405180910390f35b60fb545b60405190815260200161017c565b6101aa6101a5366004610f4c565b610407565b005b6101896101ba366004611016565b60009081526065602052604090206001015490565b61018960fb5481565b6101aa6101e6366004611044565b610494565b6101aa6101f93660046110c0565b6104bf565b7f0000000000000000000000000000000000000000000000000000000000000000610189565b6101aa610232366004611044565b610551565b6101aa610245366004611016565b6105cb565b60975460ff16610170565b610189610263366004611016565b60fc6020526000908152604090205481565b7f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b03909116815260200161017c565b6101aa6102bd366004611016565b610635565b6101aa610647565b6101aa6102d8366004611016565b50565b6102977f000000000000000000000000000000000000000000000000000000000000000081565b610170610310366004611044565b6106ff565b610189600081565b6101aa61032b36600461113a565b61072a565b6101aa61033e366004611044565b6108b3565b60405167ffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016815260200161017c565b61039461038936600461119b565b620f42409392505050565b60405163ffffffff909116815260200161017c565b6101897f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216637965db0b60e01b148061040157506301ffc9a760e01b6001600160e01b03198316145b92915050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104865760405163073e64fd60e21b81523360048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001660248201526044015b60405180910390fd5b61049082826108e8565b5050565b6000828152606560205260409020600101546104b08133610a52565b6104ba8383610ab6565b505050565b60405163912217f360e01b81527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063912217f390610518908890339089908990899089906000906004016111d0565b600060405180830381600087803b15801561053257600080fd5b505af1158015610546573d6000803e3d6000fd5b505050505050505050565b6001600160a01b03811633146105c15760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161047d565b6104908282610b3c565b60006105d76001610ba3565b9050806105f75760405163386ff4db60e21b815260040160405180910390fd5b600081815260fc60205260409020541561062457604051636429828760e11b815260040160405180910390fd5b600090815260fc6020526040902055565b60006106418133610a52565b5060fb55565b600054610100900460ff166106625760005460ff1615610666565b303b155b6106c95760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161047d565b600054610100900460ff161580156106eb576000805461ffff19166101011790555b80156102d8576000805461ff001916905550565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000604051806101a00160405280858152602001670de0b6b3a76400008152602001610761606461075b6005610ce7565b90610cfb565b815260200161076f42610d07565b63ffffffff1681526020018463ffffffff1681526020018463ffffffff168152602001600660ff168152602001836001600160a01b031681526020016000815260200160008152602001600081526020016040518060400160405280600260001b81526020016040518060200160405280600081525081525081526020016107f43390565b6001600160a01b031681525090507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316637b4b0d45826040518263ffffffff1660e01b815260040161084e91906112f1565b600060405180830381600087803b15801561086857600080fd5b505af115801561087c573d6000803e3d6000fd5b505082516040519092507f5d7903108cf8b75e960ca0af198a7322f757fd8a11bcc0f5aef0dee61c3d312f9150600090a250505050565b6000828152606560205260409020600101546108cf8133610a52565b6104ba8383610b3c565b6001600160a01b03163b151590565b600082815260fc602052604090205480610915576040516374650f9b60e01b815260040160405180910390fd5b815160011461093757604051631f9efadb60e11b815260040160405180910390fd5b600060068360008151811061094e5761094e6113da565b60200260200101516109609190611406565b6040516340437e8560e11b8152600481018490529091506000906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690638086fd0a90602401602060405180830381865afa1580156109cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109ef919061141a565b60405163636572db60e01b8152600481018590526001841b60248201526001600160a01b0380831660448301529192507f00000000000000000000000000000000000000000000000000000000000000009091169063636572db90606401610518565b610a5c82826106ff565b61049057610a74816001600160a01b03166014610d70565b610a7f836020610d70565b604051602001610a90929190611437565b60408051601f198184030181529082905262461bcd60e51b825261047d916004016114ac565b610ac082826106ff565b6104905760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610af83390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610b4682826106ff565b156104905760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6040516305d3b1d360e41b81527f0000000000000000000000000000000000000000000000000000000000000000600482015267ffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016602482015261ffff7f000000000000000000000000000000000000000000000000000000000000000016604482015263ffffffff7f0000000000000000000000000000000000000000000000000000000000000000811660648301528216608482015260009081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690635d3b1d309060a4016020604051808303816000875af1158015610cbc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ce091906114bf565b9392505050565b600061040182670de0b6b3a76400006114ee565b6000610ce0828461150d565b600063ffffffff821115610d6c5760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b606482015260840161047d565b5090565b60606000610d7f8360026114ee565b610d8a906002611521565b67ffffffffffffffff811115610da257610da2610f36565b6040519080825280601f01601f191660200182016040528015610dcc576020820181803683370190505b509050600360fc1b81600081518110610de757610de76113da565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610e1657610e166113da565b60200101906001600160f81b031916908160001a9053506000610e3a8460026114ee565b610e45906001611521565b90505b6001811115610ebd576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610e7957610e796113da565b1a60f81b828281518110610e8f57610e8f6113da565b60200101906001600160f81b031916908160001a90535060049490941c93610eb681611539565b9050610e48565b508315610ce05760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161047d565b600060208284031215610f1e57600080fd5b81356001600160e01b031981168114610ce057600080fd5b634e487b7160e01b600052604160045260246000fd5b60008060408385031215610f5f57600080fd5b8235915060208084013567ffffffffffffffff80821115610f7f57600080fd5b818601915086601f830112610f9357600080fd5b813581811115610fa557610fa5610f36565b8060051b604051601f19603f83011681018181108582111715610fca57610fca610f36565b604052918252848201925083810185019189831115610fe857600080fd5b938501935b8285101561100657843584529385019392850192610fed565b8096505050505050509250929050565b60006020828403121561102857600080fd5b5035919050565b6001600160a01b03811681146102d857600080fd5b6000806040838503121561105757600080fd5b8235915060208301356110698161102f565b809150509250929050565b60008083601f84011261108657600080fd5b50813567ffffffffffffffff81111561109e57600080fd5b6020830191508360208260051b85010111156110b957600080fd5b9250929050565b6000806000806000606086880312156110d857600080fd5b85359450602086013567ffffffffffffffff808211156110f757600080fd5b61110389838a01611074565b9096509450604088013591508082111561111c57600080fd5b5061112988828901611074565b969995985093965092949392505050565b60008060006060848603121561114f57600080fd5b83359250602084013563ffffffff8116811461116a57600080fd5b9150604084013561117a8161102f565b809150509250925092565b803560ff8116811461119657600080fd5b919050565b6000806000606084860312156111b057600080fd5b833592506111c060208501611185565b9150604084013590509250925092565b8781526001600160a01b03871660208083019190915260a0604083018190528201869052600090879060c08401835b898110156112255760ff61121285611185565b16825292820192908201906001016111ff565b5084810360608601528681526001600160fb1b0387111561124557600080fd5b8660051b9250828883830137600092010190815260809290920192909252979650505050505050565b60005b83811015611289578181015183820152602001611271565b83811115611298576000848401525b50505050565b600081518084526112b681602086016020860161126e565b601f01601f19169290920160200192915050565b8051825260006020820151604060208501526112e9604085018261129e565b949350505050565b6020815281516020820152602082015160408201526040820151606082015260006060830151611329608084018263ffffffff169052565b50608083015163ffffffff811660a08401525060a083015163ffffffff811660c08401525060c083015160ff811660e08401525060e0830151610100611379818501836001600160a01b03169052565b8401516101208481019190915284015161014080850191909152840151610160808501919091528401516101a0610180808601829052919250906113c16101c08601846112ca565b9501516001600160a01b03169301929092525090919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601260045260246000fd5b600082611415576114156113f0565b500690565b60006020828403121561142c57600080fd5b8151610ce08161102f565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161146f81601785016020880161126e565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516114a081602884016020880161126e565b01602801949350505050565b602081526000610ce0602083018461129e565b6000602082840312156114d157600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615611508576115086114d8565b500290565b60008261151c5761151c6113f0565b500490565b60008219821115611534576115346114d8565b500190565b600081611548576115486114d8565b50600019019056fea26469706673582212203939e12cb9668a6d5f2e5462b7e3cbe453f024897a070047875d51ae98de50be64736f6c634300080c0033";

type RandomDoubleDiceAppConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RandomDoubleDiceAppConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RandomDoubleDiceApp__factory extends ContractFactory {
  constructor(...args: RandomDoubleDiceAppConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    protocol: string,
    chainlinkConfig: ChainlinkConfigStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RandomDoubleDiceApp> {
    return super.deploy(
      protocol,
      chainlinkConfig,
      overrides || {}
    ) as Promise<RandomDoubleDiceApp>;
  }
  override getDeployTransaction(
    protocol: string,
    chainlinkConfig: ChainlinkConfigStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      protocol,
      chainlinkConfig,
      overrides || {}
    );
  }
  override attach(address: string): RandomDoubleDiceApp {
    return super.attach(address) as RandomDoubleDiceApp;
  }
  override connect(signer: Signer): RandomDoubleDiceApp__factory {
    return super.connect(signer) as RandomDoubleDiceApp__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RandomDoubleDiceAppInterface {
    return new utils.Interface(_abi) as RandomDoubleDiceAppInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RandomDoubleDiceApp {
    return new Contract(address, _abi, signerOrProvider) as RandomDoubleDiceApp;
  }
}