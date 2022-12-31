import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useAccount } from "contexts/AccountContext";

interface PropsI {
  children: React.ReactNode;
  hasConnectWallet?: boolean;
}

const ChooseSessionLayout = ({ children, hasConnectWallet = false }: PropsI) => {
  const { account } = useWeb3React();
  const { connectWallet, signer } = useAccount();

  if (hasConnectWallet && (!account || !signer)) return <button onClick={connectWallet}>Connect Wallet</button>;
  else return <>{children}</>;
};

export default ChooseSessionLayout;
