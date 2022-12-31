import React, { useCallback, useEffect, useMemo, useState } from "react";
import { encodeRouletteVirtualFloorMetadata } from "@doubledice/platform/lib/contracts";
import { useAccount } from "contexts/AccountContext";
import { BigNumber, BytesLike, ethers } from "ethers";
import { useRouter } from "next/router";
import { $ } from "utils/helpers";
import { toTimestamp } from "utils/toTimestamp";
import { createSession } from "web3Api/rouletteContract";
import RouletteDoubleDiceApp from   "@doubledice/platform/generated/abi/RouletteDoubleDiceApp.json"
import { GelatoRelay, SponsoredCallERC2771Request } from "@gelatonetwork/relay-sdk";

import CreateSessionInput from "../CreateSessionInput";

import * as SC from "./styles";
import networkConfig from "config/networkConfig";

interface ParamsProps {
  nSpins: number;
  paymentToken: string;
  totalFeeRate_e18: number;
  bonusAmounts: string;
  tOpen: Date;
  tResolve: Date;
  nOutcomes: number;
  optionalMinCommitmentAmount: number;
  optionalMaxCommitmentAmount: number;
  tableName: string;
  environmentName: string;
}

const CreateSessionComponent = () => {

  const [params, setParams] = useState<ParamsProps>({
    nSpins: 1,
    totalFeeRate_e18: 0,
    optionalMinCommitmentAmount: 0,
    nOutcomes: 37,
    optionalMaxCommitmentAmount: 0,
    bonusAmounts: "0",
    paymentToken: "0x9aF50EA22c0a8105db074023B6cB67E36516dBe9",
    tableName: "Custom Table Name",
    environmentName: "Custom Table Environment",
  } as ParamsProps);
  // const { signer } = useAccount();
  const [contract , setContract] = useState<ethers.Contract>()
  const [providers , setProviders] = useState<ethers.providers.Web3Provider | undefined>();
  const [contractAddress , setContractAddress] = useState<string>();
  const [relayer , setRelayer] = useState<GelatoRelay>();
  const [address , setAddress] = useState<string>()
  const [response , setResponse] = useState<string>();
  const router = useRouter();
  const spiKey = "GPuWRdiiscj25uA6k_zx3KciqQXWxCWHc3dBfrTY6KM_";
  const counter = "0x4a3d8aBbE875E16329acA654d5cC309cE87bC55D"; 
  const usdt_contract="0x9aF50EA22c0a8105db074023B6cB67E36516dBe9";
  
  
  useEffect(()=>{
    
    (async()=>{
      const relay = new GelatoRelay();
      
      console.log(relay)
      
// checking transaction = https://relay.gelato.digital/tasks/status/0x830019758e86355f75105a16468a4a38f9ce8e877018e76c26b877223caa868e 
      
 const abi =RouletteDoubleDiceApp;
 const provider = new ethers.providers.Web3Provider(window.ethereum as any);
 const signer = provider.getSigner();
 const user = await signer.getAddress();





// Set up on-chain variables, such as target address

// Generate the target payload
const contract = new ethers.Contract(counter, abi, signer);
setContract(contract);
setProviders(provider);
setContractAddress(counter);
setRelayer(relay);
setAddress(user)

})();

},[]);

useEffect(()=>{

  (async()=>{
    if(response){
      
        alert(`Roulette session is created. Will mine in less than a minute`)
      } 
    
  
     
  })()

},[response])



  const handleCreateSession = useCallback(
    async (e: any) => {
      e.preventDefault();

      let {
        nSpins,
        paymentToken,
        totalFeeRate_e18,
        bonusAmounts,
        tOpen,
        tResolve,
        nOutcomes,
        optionalMinCommitmentAmount,
        optionalMaxCommitmentAmount,
        tableName,
        environmentName,
      } = params as any;

      if (!tOpen || !tResolve) {
        alert("Invalid open or resolve date");
        return;
      }

      // Parse inputs
      tOpen = toTimestamp(tOpen);
      tResolve = toTimestamp(tResolve);
      nOutcomes = BigNumber.from(nOutcomes);
      optionalMinCommitmentAmount = $(optionalMinCommitmentAmount);
      optionalMaxCommitmentAmount = $(optionalMaxCommitmentAmount);
      totalFeeRate_e18 = BigNumber.from(10).pow(14).mul(Number(totalFeeRate_e18));
      bonusAmounts = bonusAmounts.split(",").map((bonusAmount: string) => Number(bonusAmount)) as number[];
      console.log(bonusAmounts)
      const vfIds = [];

      for (let i = 0; i < nSpins; i++) {
        const vfId = ethers.utils.hexConcat([
          "0x01",
          ethers.utils.hexlify(ethers.utils.randomBytes(8)),
          "0x00",
          "0x00000000",
        ]);

        vfIds.push(vfId);
      }

      if (bonusAmounts.length !== vfIds.length) {
        alert("BonusAmounts must correspond to vfIds length");
        return;
      }

      const metadata = encodeRouletteVirtualFloorMetadata([[tableName, environmentName]]);

      const paramsAll=  {
        vfIds,
        paymentToken,
        totalFeeRate_e18,
        bonusAmounts,
        tOpen,
        tResolve,
        nOutcomes,
        optionalMinCommitmentAmount,
        optionalMaxCommitmentAmount,
        metadata,
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const { data }:any = await contract?.populateTransaction.createRouletteSession(paramsAll);

      // Populate a relay request
      const request: SponsoredCallERC2771Request = {
        chainId: ethers.BigNumber.from(80001),
        target:counter,
        data,
        user: String(address),
      };
      
      // Without a specific API key, the relay request will fail! 
      // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
      // Send a relay request using Gelato Relay!
      try {
          const relayResponse = await relayer?.sponsoredCallERC2771(request, provider, spiKey);
        //  setResponse(relayResponse?.taskId)
         console.log(relayResponse?.taskId)

          // router.push("/");
      } catch (err: any) {
        console.log('err', err)
        alert(err.message);
      }
    },
    [params]
  );

  const disabledPreviousDates = useMemo(() => {
    const today = new Date();
    let dd, mm, yyyy;
    dd = today.getDate() + 1;
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  return (
    <SC.Form onSubmit={handleCreateSession}>
      <SC.Title>Create New Session Form</SC.Title>
      <SC.InputGrid>
        <CreateSessionInput
          type="number"
          value={params.nSpins}
          onChange={(e) => setParams((prevState) => ({ ...prevState, nSpins: e.target.value }))}
          label="Number of spins: "
        />
        <CreateSessionInput
          type="text"
          value={params.paymentToken}
          onChange={(e) => setParams((prevState) => ({ ...prevState, paymentToken: e.target.value }))}
          label="Payment Token: "
        />
        <CreateSessionInput
          type="number"
          value={params.totalFeeRate_e18}
          onChange={(e) =>
            setParams((prevState) => ({
              ...prevState,
              totalFeeRate_e18:
                e.target.value <= 100 && e.target.value >= 0 ? e.target.value : prevState.totalFeeRate_e18,
            }))
          }
          label="Total fee rate in %: "
        />
        <CreateSessionInput
          type="text"
          value={params.bonusAmounts}
          onChange={(e) => setParams((prevState) => ({ ...prevState, bonusAmounts: e.target.value }))}
          label="Initial pot (comma separated): "
        />
        <CreateSessionInput
          type="datetime-local"
          value={params.tOpen}
          min={disabledPreviousDates}
          onChange={(e) => setParams((prevState) => ({ ...prevState, tOpen: e.target.value }))}
          label="tOpen: "
        />
        <CreateSessionInput
          type="datetime-local"
          min={disabledPreviousDates}
          value={params.tResolve}
          onChange={(e) => setParams((prevState) => ({ ...prevState, tResolve: e.target.value }))}
          label="tResolve: "
        />
        <CreateSessionInput
          type="number"
          value={params.nOutcomes}
          onChange={(e) => setParams((prevState) => ({ ...prevState, nOutcomes: e.target.value }))}
          label="Number of outcomes: "
        />
        <CreateSessionInput
          type="number"
          value={params.optionalMinCommitmentAmount}
          onChange={(e) => setParams((prevState) => ({ ...prevState, optionalMinCommitmentAmount: e.target.value }))}
          label="Min commitment amount (optional): "
        />
        <CreateSessionInput
          type="number"
          value={params.optionalMaxCommitmentAmount}
          onChange={(e) => setParams((prevState) => ({ ...prevState, optionalMaxCommitmentAmount: e.target.value }))}
          label="Max commitment amount (optional): "
        />
      </SC.InputGrid>

      <SC.Subtitle>Metadata</SC.Subtitle>

      <SC.MetadataGrid>
        <CreateSessionInput
          type="text"
          value={params.tableName}
          onChange={(e) => setParams((prevState) => ({ ...prevState, tableName: e.target.value }))}
          label="Table name: "
        />
        <CreateSessionInput
          type="text"
          value={params.environmentName}
          onChange={(e) => setParams((prevState) => ({ ...prevState, environmentName: e.target.value }))}
          label="Environment name: "
        />
      </SC.MetadataGrid>

      <SC.Button type="submit">Submit</SC.Button>
    </SC.Form>
  );
};

export default CreateSessionComponent;
