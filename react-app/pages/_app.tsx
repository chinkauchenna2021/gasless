import { ApolloProvider } from "@apollo/client";
import { Web3ReactProvider } from "@web3-react/core";
import client from "config/apolloConfig";
import AccountProvider from "contexts/AccountContext";
import RouletteProvider from "contexts/RouletteContext";
import type { AppProps } from "next/app";
import { connectors } from "utils/getWalletProviders";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <ApolloProvider client={client}>
        <AccountProvider>
          <RouletteProvider>
            <Component {...pageProps} />
          </RouletteProvider>
        </AccountProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
