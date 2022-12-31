import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { AddEthereumChainParameter } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import networkConfig from "config/networkConfig";
import { ethers } from "ethers";
import { EncodedVirtualFloorMetadataStruct } from "lib/generated/typechain-types/artifacts/contracts/DoubleDiceProtocol";
import { convertNumToHexdecimal } from "utils/helpers";

export const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

export const MATIC: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

export interface BasicChainInformation {
  urls: string[];
  name: string;
}

export interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: string;
}

export type SupportedWalletsT = MetaMask | WalletConnect | Network;

export enum SupportedStateWalletEnum {
  METAMASK = "MetaMask",
  WALLET_CONNECT = "WalletConnect",
  NETWORK = "Network",
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export const urlArr = {
  [80001]: "https://rpc-mumbai.maticvigil.com",
  [137]: "https://polygon-rpc.com",
  [1337]: "http://localhost:8545",
};

export const getConnectedWalletName = (connector: SupportedWalletsT): SupportedStateWalletEnum => {
  if (connector instanceof WalletConnect) return SupportedStateWalletEnum.WALLET_CONNECT;
  else if (connector instanceof Network) return SupportedStateWalletEnum.NETWORK;
  else return SupportedStateWalletEnum.METAMASK;
};

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: [chainInformation.blockExplorerUrls],
    };
  } else {
    return chainId;
  }
}

export const switchNetwork = async () => {
  if (typeof window.ethereum !== "undefined") {
    // @ts-ignore
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: `0x${convertNumToHexdecimal(networkConfig.networkId)}`,
        },
      ],
    });
  }
};

export const addNetwork = async (id: number) => {
  let networkData;

  switch (id) {
    //polygonTestnet
    case 80001:
      networkData = [
        {
          chainId: `0x${convertNumToHexdecimal(80001)}`,
          chainName: "Mumbai Testnet",
          rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
          nativeCurrency: {
            name: "MATIC COIN",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        },
      ];

      break;

    //polygonMainet
    case 137:
      networkData = [
        {
          chainId: `0x${convertNumToHexdecimal(137)}`,
          chainName: "Polygon Mainnet",
          rpcUrls: ["https://polygon-rpc.com"],
          nativeCurrency: {
            name: "MATIC COIN",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://polygonscan.com/"],
        },
      ];

      break;

    default:
      break;
  }

  return (
    typeof window.ethereum !== "undefined" &&
    // @ts-ignore
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: networkData,
    })
  );
};

export const CHAINS: { [chainId: number]: ExtendedChainInformation } = {
  // Polygon
  137: {
    urls: ["https://polygon-rpc.com"],
    name: "Polygon Mainnet",
    nativeCurrency: MATIC,
    blockExplorerUrls: "https://polygonscan.com",
  },
  80001: {
    urls: ["https://rpc-mumbai.maticvigil.com"],
    name: "Polygon Mumbai",
    nativeCurrency: MATIC,
    blockExplorerUrls: "https://mumbai.polygonscan.com",
  },
};

export const CUSTOM_URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls;

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  },
  {}
);

export const blockchainParams = {
  chainId: process.env.NEXT_PUBLIC_BLOCKCHAIN_ID || "0x539",
  chainName: process.env.NEXT_PUBLIC_BLOCKCHAIN_NAME,
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_BLOCKCHAIN_CURRENCY_NAME,
    symbol: process.env.NEXT_PUBLIC_BLOCKCHAIN_CURRENCY_SYMBOL,
    decimals: +process.env.NEXT_PUBLIC_BLOCKCHAIN_DECIMALS!!,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL],
  blockExplorerUrls: [process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL],
};
