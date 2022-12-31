import type { NextPage } from "next";
import Head from "next/head";

import ChooseVirtualFloorPage from "components/chooseVirtualFloorPage";

const Roulette: NextPage = () => {
  return (
    <>
      <Head>
        <title>Roulette Mock</title>
        <meta
          name="description"
          content="DoubleDice is a patent-backed non-custodial gateway to the pooled betting multiverse"
        />
      </Head>
      <ChooseVirtualFloorPage />
    </>
  );
};

export default Roulette;
