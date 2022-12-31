/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  DummyERC20,
  DummyERC20Interface,
} from "../../../../../artifacts/contracts/dev/dummy/DummyERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8",
      },
    ],
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
    name: "MINTER_ROLE",
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
    name: "PAUSER_ROLE",
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
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
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
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
    outputs: [
      {
        internalType: "address",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
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
    inputs: [],
    name: "pause",
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
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162001cd538038062001cd58339810160408190526200003491620003c1565b828281818160059080519060200190620000509291906200024e565b508051620000669060069060208401906200024e565b50506007805460ff191690555062000080600033620000e9565b620000ac7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633620000e9565b620000d87f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620000e9565b505060ff1660805250620004839050565b620000f58282620000f9565b5050565b6200011082826200013c60201b620008a91760201c565b6000828152600160209081526040909120620001379183906200092d620001dc821b17901c565b505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620000f5576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001983390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000620001f3836001600160a01b038416620001fc565b90505b92915050565b60008181526001830160205260408120546200024557508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155620001f6565b506000620001f6565b8280546200025c9062000446565b90600052602060002090601f016020900481019282620002805760008555620002cb565b82601f106200029b57805160ff1916838001178555620002cb565b82800160010185558215620002cb579182015b82811115620002cb578251825591602001919060010190620002ae565b50620002d9929150620002dd565b5090565b5b80821115620002d95760008155600101620002de565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200031c57600080fd5b81516001600160401b0380821115620003395762000339620002f4565b604051601f8301601f19908116603f01168101908282118183101715620003645762000364620002f4565b816040528381526020925086838588010111156200038157600080fd5b600091505b83821015620003a5578582018301518183018401529082019062000386565b83821115620003b75760008385830101525b9695505050505050565b600080600060608486031215620003d757600080fd5b83516001600160401b0380821115620003ef57600080fd5b620003fd878388016200030a565b945060208601519150808211156200041457600080fd5b5062000423868287016200030a565b925050604084015160ff811681146200043b57600080fd5b809150509250925092565b600181811c908216806200045b57607f821691505b602082108114156200047d57634e487b7160e01b600052602260045260246000fd5b50919050565b6080516118366200049f600039600061023d01526118366000f3fe608060405234801561001057600080fd5b50600436106101845760003560e01c806370a08231116100d9578063a457c2d711610087578063a457c2d714610358578063a9059cbb1461036b578063ca15c8731461037e578063d539139314610391578063d547741f146103b8578063dd62ed3e146103cb578063e63ab1e9146103de57600080fd5b806370a08231146102c657806379cc6790146102ef5780638456cb59146103025780639010d07c1461030a57806391d148541461033557806395d89b4114610348578063a217fddf1461035057600080fd5b8063313ce56711610136578063313ce5671461023657806336568abe14610267578063395093511461027a5780633f4ba83a1461028d57806340c10f191461029557806342966c68146102a85780635c975abb146102bb57600080fd5b806301ffc9a71461018957806306fdde03146101b1578063095ea7b3146101c657806318160ddd146101d957806323b872dd146101eb578063248a9ca3146101fe5780632f2ff15d14610221575b600080fd5b61019c610197366004611482565b6103f3565b60405190151581526020015b60405180910390f35b6101b961041e565b6040516101a891906114d8565b61019c6101d4366004611527565b6104b0565b6004545b6040519081526020016101a8565b61019c6101f9366004611551565b6104c8565b6101dd61020c36600461158d565b60009081526020819052604090206001015490565b61023461022f3660046115a6565b6104ec565b005b60405160ff7f00000000000000000000000000000000000000000000000000000000000000001681526020016101a8565b6102346102753660046115a6565b610516565b61019c610288366004611527565b610599565b6102346105bb565b6102346102a3366004611527565b610639565b6102346102b636600461158d565b6106c6565b60075460ff1661019c565b6101dd6102d43660046115d2565b6001600160a01b031660009081526002602052604090205490565b6102346102fd366004611527565b6106d3565b6102346106e8565b61031d6103183660046115ed565b610762565b6040516001600160a01b0390911681526020016101a8565b61019c6103433660046115a6565b610781565b6101b96107aa565b6101dd600081565b61019c610366366004611527565b6107b9565b61019c610379366004611527565b610834565b6101dd61038c36600461158d565b610842565b6101dd7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6102346103c63660046115a6565b610859565b6101dd6103d936600461160f565b61087e565b6101dd6000805160206117c183398151915281565b60006001600160e01b03198216635a05180f60e01b1480610418575061041882610942565b92915050565b60606005805461042d90611639565b80601f016020809104026020016040519081016040528092919081815260200182805461045990611639565b80156104a65780601f1061047b576101008083540402835291602001916104a6565b820191906000526020600020905b81548152906001019060200180831161048957829003601f168201915b5050505050905090565b6000336104be818585610977565b5060019392505050565b6000336104d6858285610a9b565b6104e1858585610b15565b506001949350505050565b60008281526020819052604090206001015461050781610cb9565b6105118383610cc3565b505050565b6001600160a01b038116331461058b5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105958282610ce5565b5050565b6000336104be8185856105ac838361087e565b6105b6919061168a565b610977565b6105d36000805160206117c183398151915233610781565b61062f5760405162461bcd60e51b815260206004820152603960248201526000805160206117a183398151915260448201527876652070617573657220726f6c6520746f20756e706175736560381b6064820152608401610582565b610637610d07565b565b6106637f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633610781565b6106bc5760405162461bcd60e51b815260206004820152603660248201526000805160206117a18339815191526044820152751d99481b5a5b9d195c881c9bdb19481d1bc81b5a5b9d60521b6064820152608401610582565b6105958282610d59565b6106d03382610e14565b50565b6106de823383610a9b565b6105958282610e14565b6107006000805160206117c183398151915233610781565b61075a5760405162461bcd60e51b815260206004820152603760248201526000805160206117a183398151915260448201527676652070617573657220726f6c6520746f20706175736560481b6064820152608401610582565b610637610f42565b600082815260016020526040812061077a9083610f7f565b9392505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60606006805461042d90611639565b600033816107c7828661087e565b9050838110156108275760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610582565b6104e18286868403610977565b6000336104be818585610b15565b600081815260016020526040812061041890610f8b565b60008281526020819052604090206001015461087481610cb9565b6105118383610ce5565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b6108b38282610781565b610595576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556108e93390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061077a836001600160a01b038416610f95565b60006001600160e01b03198216637965db0b60e01b148061041857506301ffc9a760e01b6001600160e01b0319831614610418565b6001600160a01b0383166109d95760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610582565b6001600160a01b038216610a3a5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610582565b6001600160a01b0383811660008181526003602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610aa7848461087e565b90506000198114610b0f5781811015610b025760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610582565b610b0f8484848403610977565b50505050565b6001600160a01b038316610b795760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610582565b6001600160a01b038216610bdb5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610582565b610be6838383610fe4565b6001600160a01b03831660009081526002602052604090205481811015610c5e5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610582565b6001600160a01b0380851660008181526002602052604080822086860390559286168082529083902080548601905591516000805160206117e183398151915290610cac9086815260200190565b60405180910390a3610b0f565b6106d08133610fef565b610ccd82826108a9565b6000828152600160205260409020610511908261092d565b610cef8282611048565b600082815260016020526040902061051190826110ad565b610d0f6110c2565b6007805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b038216610daf5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610582565b610dbb60008383610fe4565b8060046000828254610dcd919061168a565b90915550506001600160a01b0382166000818152600260209081526040808320805486019055518481526000805160206117e1833981519152910160405180910390a35050565b6001600160a01b038216610e745760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610582565b610e8082600083610fe4565b6001600160a01b03821660009081526002602052604090205481811015610ef45760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610582565b6001600160a01b03831660008181526002602090815260408083208686039055600480548790039055518581529192916000805160206117e1833981519152910160405180910390a3505050565b610f4a61110b565b6007805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610d3c3390565b600061077a8383611151565b6000610418825490565b6000818152600183016020526040812054610fdc57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610418565b506000610418565b61051183838361117b565b610ff98282610781565b61059557611006816111e1565b6110118360206111f3565b6040516020016110229291906116a2565b60408051601f198184030181529082905262461bcd60e51b8252610582916004016114d8565b6110528282610781565b15610595576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061077a836001600160a01b03841661138f565b60075460ff166106375760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610582565b60075460ff16156106375760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610582565b600082600001828154811061116857611168611711565b9060005260206000200154905092915050565b60075460ff16156105115760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b6064820152608401610582565b60606104186001600160a01b03831660145b60606000611202836002611727565b61120d90600261168a565b67ffffffffffffffff81111561122557611225611746565b6040519080825280601f01601f19166020018201604052801561124f576020820181803683370190505b509050600360fc1b8160008151811061126a5761126a611711565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061129957611299611711565b60200101906001600160f81b031916908160001a90535060006112bd846002611727565b6112c890600161168a565b90505b6001811115611340576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106112fc576112fc611711565b1a60f81b82828151811061131257611312611711565b60200101906001600160f81b031916908160001a90535060049490941c936113398161175c565b90506112cb565b50831561077a5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610582565b600081815260018301602052604081205480156114785760006113b3600183611773565b85549091506000906113c790600190611773565b905081811461142c5760008660000182815481106113e7576113e7611711565b906000526020600020015490508087600001848154811061140a5761140a611711565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061143d5761143d61178a565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610418565b6000915050610418565b60006020828403121561149457600080fd5b81356001600160e01b03198116811461077a57600080fd5b60005b838110156114c75781810151838201526020016114af565b83811115610b0f5750506000910152565b60208152600082518060208401526114f78160408501602087016114ac565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461152257600080fd5b919050565b6000806040838503121561153a57600080fd5b6115438361150b565b946020939093013593505050565b60008060006060848603121561156657600080fd5b61156f8461150b565b925061157d6020850161150b565b9150604084013590509250925092565b60006020828403121561159f57600080fd5b5035919050565b600080604083850312156115b957600080fd5b823591506115c96020840161150b565b90509250929050565b6000602082840312156115e457600080fd5b61077a8261150b565b6000806040838503121561160057600080fd5b50508035926020909101359150565b6000806040838503121561162257600080fd5b61162b8361150b565b91506115c96020840161150b565b600181811c9082168061164d57607f821691505b6020821081141561166e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561169d5761169d611674565b500190565b76020b1b1b2b9b9a1b7b73a3937b61d1030b1b1b7bab73a1604d1b8152600083516116d48160178501602088016114ac565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516117058160288401602088016114ac565b01602801949350505050565b634e487b7160e01b600052603260045260246000fd5b600081600019048311821515161561174157611741611674565b500290565b634e487b7160e01b600052604160045260246000fd5b60008161176b5761176b611674565b506000190190565b60008282101561178557611785611674565b500390565b634e487b7160e01b600052603160045260246000fdfe45524332305072657365744d696e7465725061757365723a206d75737420686165d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862addf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220074f2e3a2c0733d4045a8f146a1d33f58ea26f8c24d6b97f7129fb824615e01564736f6c634300080c0033";

type DummyERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DummyERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DummyERC20__factory extends ContractFactory {
  constructor(...args: DummyERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: string,
    symbol: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DummyERC20> {
    return super.deploy(
      name,
      symbol,
      decimals_,
      overrides || {}
    ) as Promise<DummyERC20>;
  }
  override getDeployTransaction(
    name: string,
    symbol: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, decimals_, overrides || {});
  }
  override attach(address: string): DummyERC20 {
    return super.attach(address) as DummyERC20;
  }
  override connect(signer: Signer): DummyERC20__factory {
    return super.connect(signer) as DummyERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DummyERC20Interface {
    return new utils.Interface(_abi) as DummyERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DummyERC20 {
    return new Contract(address, _abi, signerOrProvider) as DummyERC20;
  }
}