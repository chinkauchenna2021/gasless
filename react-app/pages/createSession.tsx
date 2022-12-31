import type { NextPage } from "next";
import Head from "next/head";

import CreateSessionPage from "components/createSessionPage";

const CreateSession: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Roulette Session</title>
        <meta
          name="description"
          content="DoubleDice is a patent-backed non-custodial gateway to the pooled betting multiverse"
        />
      </Head>
      <CreateSessionPage />
    </>
  );
};

export default CreateSession;
