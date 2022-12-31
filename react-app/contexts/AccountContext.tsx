import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { blockchainParams } from "utils/chains";

interface AccountContextData {
  provider?: Web3Provider;
  accountAddress?: string;
  signer?: ethers.providers.JsonRpcSigner;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AccountContext = createContext<AccountContextData>({} as AccountContextData);

interface AccountProviderProps {
  children: React.ReactNode;
}

const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<Web3Provider | undefined>();
  const [accountAddress, setAccountAddress] = useState<string | undefined>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();

  const connectToWallet = useCallback(async () => {
    if (!window?.ethereum || typeof window.ethereum === "undefined") {
      alert("Metamask is not installed, please install!");
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);

    const signer = web3Provider.getSigner();
    const address = await signer?.getAddress();

    console.log({ signer, address });

    setProvider(web3Provider);
    setSigner(signer);
    setAccountAddress(address);
    localStorage.setItem("isWalletConnected", "true");
  }, []);

  const requestChangeNetworkAndConnect = useCallback(async () => {
    if (!window?.ethereum || typeof window.ethereum === "undefined") {
      alert("Metamask is not installed, please install!");
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    const { chainId } = await web3Provider.getNetwork();

    console.log({ chainId });
    

    if (blockchainParams.chainId) {
      console.info(chainId, parseInt(blockchainParams.chainId, 16));

      if (chainId !== parseInt(blockchainParams.chainId, 16)) {
        try {
          // @ts-ignore
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: blockchainParams.chainId }],
          });

          await connectToWallet();
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError?.code === 4902) {
            try {
              // @ts-ignore
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [blockchainParams],
              });
              await connectToWallet();
            } catch (addError) {
              console.log(addError);
              alert(addError);
              localStorage.setItem("isWalletConnected", "false");
            }
          } else if (switchError?.code === 4001) {
            alert("To connect your wallet you must switch to the right network!");
            localStorage.setItem("isWalletConnected", "false");
          }
        }
      } else {
        connectToWallet();
      }
    }
  }, [connectToWallet]);

  const connectWallet = useCallback(async () => {
    try {
      await connectToWallet();
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }, [connectToWallet]);

  const disconnectWallet = useCallback(() => {
    setAccountAddress(undefined);
    localStorage.setItem("isWalletConnected", "false");
  }, []);

  useEffect(() => {
    requestChangeNetworkAndConnect();
  }, [requestChangeNetworkAndConnect]);

  const contextValue = useMemo(
    () => ({
      provider,
      accountAddress,
      signer,
      connectWallet,
      disconnectWallet,
    }),
    [provider, connectWallet, accountAddress, signer, disconnectWallet]
  );

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>;
};

export const useAccount = (): AccountContextData => {
  const context = useContext(AccountContext);

  return context;
};

export default AccountProvider;
