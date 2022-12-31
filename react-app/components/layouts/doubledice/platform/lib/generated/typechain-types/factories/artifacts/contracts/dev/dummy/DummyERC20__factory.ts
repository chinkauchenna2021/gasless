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
  "0x60a06040523480156200001157600080fd5b5060405162001dea38038062001dea8339810160408190526200003491620003c1565b828281818160059080519060200190620000509291906200024e565b508051620000669060069060208401906200024e565b50506007805460ff191690555062000080600033620000e9565b620000ac7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633620000e9565b620000d87f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620000e9565b505060ff1660805250620004839050565b620000f58282620000f9565b5050565b6200011082826200013c60201b620009901760201c565b60008281526001602090815260409091206200013791839062000a14620001dc821b17901c565b505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620000f5576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001983390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000620001f3836001600160a01b038416620001fc565b90505b92915050565b60008181526001830160205260408120546200024557508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155620001f6565b506000620001f6565b8280546200025c9062000446565b90600052602060002090601f016020900481019282620002805760008555620002cb565b82601f106200029b57805160ff1916838001178555620002cb565b82800160010185558215620002cb579182015b82811115620002cb578251825591602001919060010190620002ae565b50620002d9929150620002dd565b5090565b5b80821115620002d95760008155600101620002de565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200031c57600080fd5b81516001600160401b0380821115620003395762000339620002f4565b604051601f8301601f19908116603f01168101908282118183101715620003645762000364620002f4565b816040528381526020925086838588010111156200038157600080fd5b600091505b83821015620003a5578582018301518183018401529082019062000386565b83821115620003b75760008385830101525b9695505050505050565b600080600060608486031215620003d757600080fd5b83516001600160401b0380821115620003ef57600080fd5b620003fd878388016200030a565b945060208601519150808211156200041457600080fd5b5062000423868287016200030a565b925050604084015160ff811681146200043b57600080fd5b809150509250925092565b600181811c908216806200045b57607f821691505b602082108114156200047d57634e487b7160e01b600052602260045260246000fd5b50919050565b60805161194b6200049f600039600061027d015261194b6000f3fe608060405234801561001057600080fd5b50600436106101c45760003560e01c806370a08231116100f9578063a457c2d711610097578063d539139311610071578063d5391393146103d1578063d547741f146103f8578063dd62ed3e1461040b578063e63ab1e91461044457600080fd5b8063a457c2d714610398578063a9059cbb146103ab578063ca15c873146103be57600080fd5b80639010d07c116100d35780639010d07c1461034a57806391d148541461037557806395d89b4114610388578063a217fddf1461039057600080fd5b806370a082311461030657806379cc67901461032f5780638456cb591461034257600080fd5b8063313ce567116101665780633f4ba83a116101405780633f4ba83a146102cd57806340c10f19146102d557806342966c68146102e85780635c975abb146102fb57600080fd5b8063313ce5671461027657806336568abe146102a757806339509351146102ba57600080fd5b806318160ddd116101a257806318160ddd1461021957806323b872dd1461022b578063248a9ca31461023e5780632f2ff15d1461026157600080fd5b806301ffc9a7146101c957806306fdde03146101f1578063095ea7b314610206575b600080fd5b6101dc6101d73660046115f1565b61046b565b60405190151581526020015b60405180910390f35b6101f9610496565b6040516101e89190611647565b6101dc610214366004611696565b610528565b6004545b6040519081526020016101e8565b6101dc6102393660046116c0565b610540565b61021d61024c3660046116fc565b60009081526020819052604090206001015490565b61027461026f366004611715565b610564565b005b60405160ff7f00000000000000000000000000000000000000000000000000000000000000001681526020016101e8565b6102746102b5366004611715565b61058f565b6101dc6102c8366004611696565b610612565b610274610651565b6102746102e3366004611696565b6106f7565b6102746102f63660046116fc565b610796565b60075460ff166101dc565b61021d610314366004611741565b6001600160a01b031660009081526002602052604090205490565b61027461033d366004611696565b6107a3565b6102746107b8565b61035d61035836600461175c565b61085c565b6040516001600160a01b0390911681526020016101e8565b6101dc610383366004611715565b61087b565b6101f96108a4565b61021d600081565b6101dc6103a6366004611696565b6108b3565b6101dc6103b9366004611696565b610945565b61021d6103cc3660046116fc565b610953565b61021d7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b610274610406366004611715565b61096a565b61021d61041936600461177e565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b61021d7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b60006001600160e01b03198216635a05180f60e01b1480610490575061049082610a29565b92915050565b6060600580546104a5906117a8565b80601f01602080910402602001604051908101604052809291908181526020018280546104d1906117a8565b801561051e5780601f106104f35761010080835404028352916020019161051e565b820191906000526020600020905b81548152906001019060200180831161050157829003601f168201915b5050505050905090565b600033610536818585610a5e565b5060019392505050565b60003361054e858285610b82565b610559858585610c14565b506001949350505050565b6000828152602081905260409020600101546105808133610ded565b61058a8383610e51565b505050565b6001600160a01b03811633146106045760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61060e8282610e73565b5050565b3360008181526003602090815260408083206001600160a01b0387168452909152812054909190610536908290869061064c9087906117f9565b610a5e565b61067b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3361087b565b6106ed5760405162461bcd60e51b815260206004820152603960248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20756e70617573650000000000000060648201526084016105fb565b6106f5610e95565b565b6107217f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63361087b565b61078c5760405162461bcd60e51b815260206004820152603660248201527f45524332305072657365744d696e7465725061757365723a206d7573742068616044820152751d99481b5a5b9d195c881c9bdb19481d1bc81b5a5b9d60521b60648201526084016105fb565b61060e8282610f28565b6107a03382611013565b50565b6107ae823383610b82565b61060e8282611013565b6107e27f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3361087b565b6108545760405162461bcd60e51b815260206004820152603760248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20706175736500000000000000000060648201526084016105fb565b6106f561116d565b600082815260016020526040812061087490836111e8565b9392505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b6060600680546104a5906117a8565b3360008181526003602090815260408083206001600160a01b0387168452909152812054909190838110156109385760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016105fb565b6105598286868403610a5e565b600033610536818585610c14565b6000818152600160205260408120610490906111f4565b6000828152602081905260409020600101546109868133610ded565b61058a8383610e73565b61099a828261087b565b61060e576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556109d03390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610874836001600160a01b0384166111fe565b60006001600160e01b03198216637965db0b60e01b148061049057506301ffc9a760e01b6001600160e01b0319831614610490565b6001600160a01b038316610ac05760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016105fb565b6001600160a01b038216610b215760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016105fb565b6001600160a01b0383811660008181526003602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038381166000908152600360209081526040808320938616835292905220546000198114610c0e5781811015610c015760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016105fb565b610c0e8484848403610a5e565b50505050565b6001600160a01b038316610c785760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016105fb565b6001600160a01b038216610cda5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016105fb565b610ce583838361124d565b6001600160a01b03831660009081526002602052604090205481811015610d5d5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016105fb565b6001600160a01b03808516600090815260026020526040808220858503905591851681529081208054849290610d949084906117f9565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610de091815260200190565b60405180910390a3610c0e565b610df7828261087b565b61060e57610e0f816001600160a01b03166014611258565b610e1a836020611258565b604051602001610e2b929190611811565b60408051601f198184030181529082905262461bcd60e51b82526105fb91600401611647565b610e5b8282610990565b600082815260016020526040902061058a9082610a14565b610e7d82826113f4565b600082815260016020526040902061058a9082611459565b60075460ff16610ede5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016105fb565b6007805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b038216610f7e5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105fb565b610f8a6000838361124d565b8060046000828254610f9c91906117f9565b90915550506001600160a01b03821660009081526002602052604081208054839290610fc99084906117f9565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b0382166110735760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016105fb565b61107f8260008361124d565b6001600160a01b038216600090815260026020526040902054818110156110f35760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016105fb565b6001600160a01b0383166000908152600260205260408120838303905560048054849290611122908490611886565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b60075460ff16156111b35760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016105fb565b6007805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610f0b3390565b6000610874838361146e565b6000610490825490565b600081815260018301602052604081205461124557508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610490565b506000610490565b61058a838383611498565b6060600061126783600261189d565b6112729060026117f9565b67ffffffffffffffff81111561128a5761128a6118bc565b6040519080825280601f01601f1916602001820160405280156112b4576020820181803683370190505b509050600360fc1b816000815181106112cf576112cf6118d2565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106112fe576112fe6118d2565b60200101906001600160f81b031916908160001a905350600061132284600261189d565b61132d9060016117f9565b90505b60018111156113a5576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611361576113616118d2565b1a60f81b828281518110611377576113776118d2565b60200101906001600160f81b031916908160001a90535060049490941c9361139e816118e8565b9050611330565b5083156108745760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105fb565b6113fe828261087b565b1561060e576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610874836001600160a01b0384166114fe565b6000826000018281548110611485576114856118d2565b9060005260206000200154905092915050565b60075460ff161561058a5760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b60648201526084016105fb565b600081815260018301602052604081205480156115e7576000611522600183611886565b855490915060009061153690600190611886565b905081811461159b576000866000018281548110611556576115566118d2565b9060005260206000200154905080876000018481548110611579576115796118d2565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806115ac576115ac6118ff565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610490565b6000915050610490565b60006020828403121561160357600080fd5b81356001600160e01b03198116811461087457600080fd5b60005b8381101561163657818101518382015260200161161e565b83811115610c0e5750506000910152565b602081526000825180602084015261166681604085016020870161161b565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461169157600080fd5b919050565b600080604083850312156116a957600080fd5b6116b28361167a565b946020939093013593505050565b6000806000606084860312156116d557600080fd5b6116de8461167a565b92506116ec6020850161167a565b9150604084013590509250925092565b60006020828403121561170e57600080fd5b5035919050565b6000806040838503121561172857600080fd5b823591506117386020840161167a565b90509250929050565b60006020828403121561175357600080fd5b6108748261167a565b6000806040838503121561176f57600080fd5b50508035926020909101359150565b6000806040838503121561179157600080fd5b61179a8361167a565b91506117386020840161167a565b600181811c908216806117bc57607f821691505b602082108114156117dd57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561180c5761180c6117e3565b500190565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161184981601785016020880161161b565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161187a81602884016020880161161b565b01602801949350505050565b600082821015611898576118986117e3565b500390565b60008160001904831182151516156118b7576118b76117e3565b500290565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b6000816118f7576118f76117e3565b506000190190565b634e487b7160e01b600052603160045260246000fdfea26469706673582212201251ecdc43494b5eeb27c4958139011a12b57eb382726d20c2bc75306700d7c964736f6c634300080c0033";

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
