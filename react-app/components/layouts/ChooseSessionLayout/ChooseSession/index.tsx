import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { RouletteSession } from "@doubledice/platform/lib/graph";
import { useRoulette } from "contexts/RouletteContext";
import { ROULETTE_SESSIONS } from "graphql/queries";
import { useRouter } from "next/router";
import { convertTimestampToDate } from "utils/helpers";
import  DummyUSDTethers from '../../../layouts/doubledice/platform/artifacts/contracts/dev/dummy/DummyUSDTether.sol/DummyUSDTether.json';
import { GelatoRelay, SponsoredCallERC2771Request } from "@gelatonetwork/relay-sdk";
import RouletteDoubleDiceApp from   "@doubledice/platform/generated/abi/RouletteDoubleDiceApp.json"
// import DoublediceAbi from "../../../layouts/doubledice/platform/artifacts/contracts/DoubleDice.sol/DoubleDice.json"

import * as SC from "./styles";
import { BigNumber, ethers } from "ethers";
import networkConfig from "config/networkConfig";

const ChooseSessionComponent = () => {
  const [rouletteSessions, setRouletteSessions] = useState<RouletteSession[]>([]);
  
  
  const [usdtSigner , setUsdtSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [contract , setContract] = useState<ethers.Contract>()
  const [providers , setProviders] = useState<ethers.providers.Web3Provider | undefined>();
  const [contractAddress , setContractAddress] = useState<string>();
  const [relayer , setRelayer] = useState<GelatoRelay>();
  const [addresses , setAddress] = useState<string>();
  const usdt_contract="0x9aF50EA22c0a8105db074023B6cB67E36516dBe9";
  const spiKey = "GPuWRdiiscj25uA6k_zx3KciqQXWxCWHc3dBfrTY6KM_";
  const platform_address = "0xFC1FE26d9aD05891b9F99831E7b9915415a9ed43";
  
  
  
  const { loading } = useQuery<{ rouletteSessions: RouletteSession[] }>(ROULETTE_SESSIONS, {
    onCompleted(data) {
      if (data) setRouletteSessions(data.rouletteSessions);
    },
    onError(error) {
      console.log(error);      
    },
  });  

useEffect(()=>{
(async()=>{
  const relay = new GelatoRelay();
    
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const signer = provider.getSigner();
  const user = await signer.getAddress();


  setUsdtSigner(signer)

// Generate the target payload

setProviders(provider);
setRelayer(relay);
setAddress(user)
setUsdtSigner(signer);
})()
},[])






  const { joinRouletteSession } = useRoulette();
  const router = useRouter();

  const handleJoinSession = useCallback(
    async (sessionId: any, vfIds: string[], currentRoundNum: number) => {
      try {
        await joinRouletteSession(sessionId, vfIds, currentRoundNum);

        router.push("/roulette");
      } catch (err: any) {
        alert(err.message);
      }
    },
    [joinRouletteSession]
  );




const  increaseAllowance = async () =>{
  try{

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    let contract = new ethers.Contract(usdt_contract,DummyUSDTethers.abi,usdtSigner);

    let  provider_signer = await provider?.getSigner();
    let user_address = await provider_signer?.getAddress();
    let balance = ( await contract.balanceOf(user_address))
    let contract_allowance = BigNumber.from(balance).mul(BigNumber.from(10).pow(12)) ;

    const { data }:any = await contract?.populateTransaction.approve(platform_address,contract_allowance);

   // Populate a relay request
   const request: SponsoredCallERC2771Request = {
     chainId: ethers.BigNumber.from(80001),
     target:usdt_contract,
     data,
     user: String(addresses),
   };
   
   // Without a specific API key, the relay request will fail! 
   // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
   // Send a relay request using Gelato Relay!
 
  let response = await relayer?.sponsoredCallERC2771(request, provider, spiKey);
  console.log("details")
  console.log(Number(balance))
  console.log(response?.taskId)
  alert('Wait for a minute to mine your transaction');

  }catch(e){
    console.log(e)
  }
}







  if (loading) {
    return <p>Loading...</p>;
  }

  console.log({ rouletteSessions });
  

  return (
    <SC.Container>
      <div>
        <SC.Title>Choose existent session</SC.Title>
        <div style={{display:"flex", justifyContent:"center",marginBottom:"20px", color:"red"}}>Ensure to Grant USDT token allowance before creating or placing bets</div>

        <SC.TableContainer>
          <table id="customers">
            <thead>
              <tr>
                <th>Table ID</th>
                <th>Table Name</th>
                <th>Table Environment Name</th>
                <th>TOpen</th>
                <th>TResolve</th>
              </tr>
            </thead>

            <tbody>
              {rouletteSessions.length > 0
                ? rouletteSessions.map((session, index) => (
                  <tr key={index} onClick={() => {
                    router.push(`/session/${session.tableId}`);
                  }}>
                    <td>{session.tableId}</td>
                    <td>{session.tableName}</td>
                    <td>{session.environmentName}</td>
                    <td>{convertTimestampToDate(session.tOpen)}</td>
                    <td>{convertTimestampToDate(session.tResolve)}</td>
                  </tr>
                ))
                : "There are no active sessions"}
            </tbody>
          </table>
        </SC.TableContainer>

      </div>
      <div>
      <SC.CreateNewSession
        onClick={() =>increaseAllowance()}>
        Grant USDT allowance
      </SC.CreateNewSession>
      <SC.CreateNewSession
        onClick={() => {
          router.push("/createSession");
        }}>
        Create new Session
      </SC.CreateNewSession>
      </div>
    </SC.Container>
  );
};

export default ChooseSessionComponent;
