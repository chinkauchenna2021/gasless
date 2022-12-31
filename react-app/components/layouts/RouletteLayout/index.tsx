import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useAccount } from "contexts/AccountContext";

interface PropsI {
  children: React.ReactNode;
  hasConnectWallet?: boolean;
}

const RouletteLayout = ({ children, hasConnectWallet }: PropsI) => {
  const { account } = useWeb3React();
  const { connectWallet } = useAccount();

  if (hasConnectWallet && !account) return <button onClick={connectWallet}>Connect Wallet</button>;
  else return <>{children}</>;
};

export default RouletteLayout;
