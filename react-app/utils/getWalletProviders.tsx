import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { hooks as metaMaskHooks, metaMask } from "connectors/metaMask";
import { hooks as networkHooks, network } from "connectors/network";
import { hooks as walletConnectHooks, walletConnect } from "connectors/walletConnect";

import { SupportedStateWalletEnum, SupportedWalletsT } from "./chains";

// import MetaMaskLogo from "components/icons/MetaMaskLogo";
// import WalletConnectLogo from "components/icons/WalletConnectLogo";

export const connectors: [MetaMask | WalletConnect | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [network, networkHooks],
];

interface SupportedWalletsI {
  [key: string]: SupportedWalletsT;
}

export const supportedWallets: SupportedWalletsI = {
  [SupportedStateWalletEnum.WALLET_CONNECT]: walletConnect,
  [SupportedStateWalletEnum.NETWORK]: network,
  [SupportedStateWalletEnum.METAMASK]: metaMask,
};

// const defaultClassNames = "h-4 w-4";

interface WalletProviderI {
  name: SupportedStateWalletEnum;
  connector: SupportedWalletsT;
  showOnMobile: boolean;
  // iconComponentFn: (className: string) => React.ReactNode;
}

export const walletProviders: WalletProviderI[] = [
  {
    name: SupportedStateWalletEnum.METAMASK,
    connector: supportedWallets[SupportedStateWalletEnum.METAMASK],
    showOnMobile: false,
    // iconComponentFn: (className: string = defaultClassNames) => <MetaMaskLogo className={className} />,
  },
  {
    name: SupportedStateWalletEnum.WALLET_CONNECT,
    connector: supportedWallets[SupportedStateWalletEnum.WALLET_CONNECT],
    showOnMobile: true,
    // iconComponentFn: (className: string = defaultClassNames) => <WalletConnectLogo className={className} />,
  },
];

export const getProvider = (walletName: SupportedStateWalletEnum) => {
  return walletProviders.filter((wallet) => wallet.name === walletName)[0];
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  connectors,
  supportedWallets,
  walletProviders,
  getProvider,
};
