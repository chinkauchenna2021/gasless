import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { prepareVirtualFloorClaim, RouletteVirtualFloor, User, VirtualFloor, VirtualFloorClaimType } from "@doubledice/platform/lib/graph";
import assert from "assert";
import { BigNumber as BigDecimal } from "bignumber.js";
import { useAccount } from "contexts/AccountContext";
import { useRoulette } from "contexts/RouletteContext";
import { BigNumber, ContractTransaction, ethers } from "ethers";
import { USER_SPECIFIC_VIRTUAL_FLOOR } from "graphql/queries";
import { convertNumToBigInt, formatTimestamp, getSystemTimestamp, VirtualFloorState } from "utils/helpers";
import { claimPayouts, claimRefunds, commitToSpin, CommitToSpinParams, getUsdcBalance, getVirtualFloorState, resolveSpin } from "web3Api/rouletteContract";
import { $ } from "utils/helpers";
import { GelatoRelay, SponsoredCallERC2771Request } from "@gelatonetwork/relay-sdk";
import RouletteDoubleDiceApp from   "@doubledice/platform/generated/abi/RouletteDoubleDiceApp.json"
import * as SC from "./styles";
import { Web3Provider } from "@ethersproject/providers";
import  DummyUSDTethers from '../../../layouts/doubledice/platform/artifacts/contracts/dev/dummy/DummyUSDTether.sol/DummyUSDTether.json';
import DoublediceAbi from '@doubledice/platform/artifacts/contracts/DoubleDiceProtocol.sol/DoubleDiceProtocol.json'
interface IProps {
  virtualFloor: RouletteVirtualFloor
}

interface Commits {
  amount: number;
  outcomeIndexes: number[]
}

const RouletteBetsManager = ({ virtualFloor }: IProps) => {

  const [amount, setAmount] = useState(0);
  const [latestBlockTimestamp, setLatestBlockTimestamp] = useState(0);
  const [userSpecificVirtualFloor, setUserSpecificVirtualFloor] = useState<VirtualFloor | null>();
  const [nextBlockTimestamp, setNextBlockTimestamp] = useState(0);
  const [nextBlockInterval, setNextBlockInterval] = useState<any>();
  const [timeAdjustment, setTimeAdjustment] = useState(0);
  const [canBeResolved, setCanBeResolved] = useState(false);
  const [canCommit, setCanCommit] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  const [provider, setProvider] = useState<Web3Provider | undefined>();
  const [accountAddress, setAccountAddress] = useState<string>('');
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();

  const [contract , setContract] = useState<ethers.Contract>()
  const [providers , setProviders] = useState<ethers.providers.Web3Provider | undefined>();
  const [contractAddress , setContractAddress] = useState<string>();
  const [relayer , setRelayer] = useState<GelatoRelay>();
  const [addresses , setAddress] = useState<string>();
  const [usdtSigner , setUsdtSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [doublediceContract , setDoublediceContract] = useState<ethers.Contract>()

  const spiKey = "GPuWRdiiscj25uA6k_zx3KciqQXWxCWHc3dBfrTY6KM_";
  const counter = "0x4a3d8aBbE875E16329acA654d5cC309cE87bC55D"; 
  const usdt_contract="0x9aF50EA22c0a8105db074023B6cB67E36516dBe9";
  const doublediceAddress = "0xFC1FE26d9aD05891b9F99831E7b9915415a9ed43";
  
  const [commits, setCommits] = useState<Commits[]>([]);
  // const { signer, accountAddress } = useAccount();

  const { } = useQuery<{ virtualFloors: VirtualFloor[]; user: User | null }>(USER_SPECIFIC_VIRTUAL_FLOOR, {
    variables: {
      vfIntId: virtualFloor.intId,
      userId: accountAddress.toLowerCase(),
    },
    onCompleted(data) {
      setUserSpecificVirtualFloor(data.virtualFloors[0]);
    },
    onError(error) {
      console.log(error);
      
    },
  });

  const {
    currentOutcomeIndexes,
    setCurrentOutcomeIndexes
  } = useRoulette();

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
const doublediceInstance = new ethers.Contract(doublediceAddress,DoublediceAbi.abi,signer)

setDoublediceContract(doublediceInstance)
setContract(contract);
setProviders(provider);
setContractAddress(counter);
setRelayer(relay);
setAddress(user)
setUsdtSigner(signer)

})();

},[]);


  const claimButtonText = (): string => {

    if (userSpecificVirtualFloor) {
      const claim = prepareVirtualFloorClaim(userSpecificVirtualFloor);
  
      assert(claim)
      const what = claim.claimType === VirtualFloorClaimType.Payouts ? 'winnings' : 'refunds'
      return `Claim ${virtualFloor.paymentToken.symbol} ${claim.totalClaimAmount} in ${what}`
    }

    return '';

  }

  const loadBalance = useCallback(async () => {

    if (usdtSigner == undefined) return;
    let usdt = new ethers.Contract(usdt_contract,DummyUSDTethers.abi,usdtSigner)
    let  provider_signer = await provider?.getSigner();
    let user_address = await provider_signer?.getAddress();
   let balance = ( await usdt.balanceOf(user_address))
    let balance_conversion = (Number(balance) / Math.pow(10,6))
    // let balance = (await usdt.balanceOf(addresses)).toNumber() / 1000000;
    // console.log(balance)
    setUserBalance(balance_conversion);
  }, [usdtSigner]);

  const getCurrentTimestamp = useCallback(async () => {
    const directProvider = new ethers.providers.Web3Provider(window.ethereum as any);
    let adjustment = 0;
    try {
      // Note: This is the only way of "squeezing" this Ganache-internal value out of Ganache
      // See https://github.com/trufflesuite/ganache/blob/v7.0.0-alpha.0/src/chains/ethereum/ethereum/src/blockchain.ts#L713
      // adjustment = await directProvider.send("evm_increaseTime", [0]);
    } catch (e) {
      adjustment = 0;
    }

    const { timestamp } = await directProvider.getBlock("latest");
    setLatestBlockTimestamp(timestamp);
    setTimeAdjustment(adjustment);
  }, []);

  useEffect(() => {
    loadBalance();
    getCurrentTimestamp();
  }, [loadBalance, getCurrentTimestamp]);


  const connectToWallet = async () => {
    if (!window?.ethereum || typeof window.ethereum === "undefined") {
      alert("Metamask is not installed, please install!");
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = web3Provider.getSigner();
    const address = await signer?.getAddress();

    console.log({ signer, address });

    setProvider(web3Provider);
    setSigner(signer);
    setAccountAddress(address);
  }
  useEffect(() => {
    if (!accountAddress) {
      connectToWallet()
    }
  })
  useEffect(() => {

    if (nextBlockInterval !== undefined) {
      clearInterval(nextBlockInterval);
    }

    const interval = setInterval(async () => {
      if (signer) {
        setNextBlockTimestamp(getSystemTimestamp() + timeAdjustment);

        const vfState = await doublediceContract?.getVirtualFloorState(virtualFloor.intId);

        setCanBeResolved(vfState === VirtualFloorState.Active_Closed_ResolvableNow);
        setCanCommit(
          vfState === VirtualFloorState.Active_Open_MaybeResolvableNever ||
          vfState === VirtualFloorState.Active_Open_ResolvableLater
        );
      }
    }, 1000);

    setNextBlockInterval(interval);

    return () => clearInterval(interval);
  }, [timeAdjustment, accountAddress, virtualFloor.intId]);


  const handlePlaceBet = useCallback(() => {
    if (!currentOutcomeIndexes.length) {
      alert("No outcomes");
      return;
    }
    if (!amount) {
      alert("No amount");
      return;
    }

    if (userBalance < amount) {
      alert("Insufficient balance");
      return;
    }

    // todo: validate if bet is greater than minAmount and less than maxAmount

    setUserBalance(userBalance - amount);

    setCommits((prevState) => [...prevState, { outcomeIndexes: currentOutcomeIndexes, amount }])

    setCurrentOutcomeIndexes([]);
    setAmount(0);
  }, [userBalance, amount, currentOutcomeIndexes, setCurrentOutcomeIndexes]);

  const handleRemoveBet = (commitIndex: number) => {
    const data = commits?.filter((commit, index) => index !== commitIndex);
    setCommits(data)
  }

  const fastForward = useCallback(async ({ days = 0, hours = 0, minutes = 0, seconds = 0 }): Promise<void> => {
    const directProvider = new ethers.providers.Web3Provider(window.ethereum as any);
    console.log(`fastForwarding time by ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`);

    const adjustment = await directProvider.send("evm_increaseTime", [
      ((days * 24 + hours) * 60 + minutes) * 60 + seconds,
    ]);
    await directProvider.send("evm_mine", []);
    const { timestamp } = await directProvider.getBlock("latest");
    setLatestBlockTimestamp(timestamp);
    setTimeAdjustment(adjustment);
  }, []);

  const commitToVirtualFloor = async () => {
    if (!signer) return

    try {
      const outcomeIndexes = [];
      const amounts  = [];

      for (const commit of commits) {
        const amount = new BigDecimal(commit.amount).dividedBy(new BigDecimal(commit.outcomeIndexes.length));

        for (let i = 0; i < commit.outcomeIndexes.length; i++) {
          outcomeIndexes.push(commit.outcomeIndexes[i]);
          const amountInBigInt = convertNumToBigInt(10, virtualFloor.paymentToken.decimals, amount.toString());
          console.log({ amountInBigInt: amountInBigInt.toString() });

          amounts.push(amountInBigInt.toString());
        }

        // const dividedAmount = Math.floor((bet.amount / bet.outcomeIndexes.length) * 10) / 10;
        // const dividedAmountInteger = Number(String(dividedAmount).split(".")[0]);
        // const dividedAmountDecimals = Number((dividedAmount % 1).toFixed(6).substring(2));

        // for (let i = 0; i < bet.outcomeIndexes.length; i++) {
        //   outcomeIndexes.push(BigNumber.from(bet.outcomeIndexes[i]));

        //   amounts.push($(dividedAmountInteger, dividedAmountDecimals));
        // }

 

      }

      const multCommit: CommitToSpinParams = {
        vfId: virtualFloor.id,
        outcomeIndexes,
        amounts,
        optionalDeadline: 0
      };

      console.log({multCommit});
    
   
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const { data }:any = await contract?.populateTransaction.commitToVirtualFloor(multCommit.vfId,multCommit.outcomeIndexes,multCommit.amounts,multCommit.optionalDeadline);

      // Populate a relay request
      const request: SponsoredCallERC2771Request = {
        chainId: ethers.BigNumber.from(80001),
        target:counter,
        data,
        user: String(addresses),
      };
      
      // Without a specific API key, the relay request will fail! 
      // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
      // Send a relay request using Gelato Relay!
    
     await relayer?.sponsoredCallERC2771(request, provider, spiKey);
     alert('you have successfully committed to roulette spin');

    } catch (err: any) {
      console.log(err);

      alert(err.message);
    }
  };

  const resolveRouletteSpin = async () => {
    const vfId = virtualFloor.intId;

    if (!vfId) {
      alert("VF not found");
      return;
    }

    if (!signer) return;

    try {

    
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const { data }:any = await contract?.populateTransaction.resolveSpin(signer, vfId);

      // Populate a relay request
      const request: SponsoredCallERC2771Request = {
        chainId: ethers.BigNumber.from(80001),
        target:counter,
        data,
        user: String(addresses),
      };
      
      // Without a specific API key, the relay request will fail! 
      // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
      // Send a relay request using Gelato Relay!
    
          const relayResponse = await relayer?.sponsoredCallERC2771(request, provider, spiKey);
          alert('Your resolve spin active . Will mine in within a minute');


    } catch (err: any) {
      console.log(err);
      alert(err.message)
    }
  };

  const claim = async () => {

    if (!userSpecificVirtualFloor) {
      return
    }
    const preparedClaim = await prepareVirtualFloorClaim(userSpecificVirtualFloor);
    assert(preparedClaim)
    // eslint-disable-next-line space-before-function-paren
    try {
      let tx: ContractTransaction
      if (preparedClaim.claimType === VirtualFloorClaimType.Payouts) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const { data }:any = await contract?.populateTransaction.claimPayouts(signer, virtualFloor.id, preparedClaim.tokenIds);
        // Populate a relay request
        const request: SponsoredCallERC2771Request = {
          chainId: ethers.BigNumber.from(80001),
          target:counter,
          data,
          user: String(addresses),
        };
        
        // Without a specific API key, the relay request will fail! 
        // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
        // Send a relay request using Gelato Relay!
      
       await relayer?.sponsoredCallERC2771(request, provider, spiKey);
  
       alert('your claim payout request is received ');





      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const { data }:any = await contract?.populateTransaction.claimRefunds(signer, virtualFloor.id, preparedClaim.tokenIds)
        // Populate a relay request
        const request: SponsoredCallERC2771Request = {
          chainId: ethers.BigNumber.from(80001),
          target:counter,
          data,
          user: String(addresses),
        };
        
        // Without a specific API key, the relay request will fail! 
        // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
        // Send a relay request using Gelato Relay!
      
       await relayer?.sponsoredCallERC2771(request, provider, spiKey);
  
      alert('your claim refund request is received ');






      }
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <SC.Container>
      <SC.Title>
        {/* Current Spin Number: {currentRound}/{spinNum} */}
      </SC.Title>
      <SC.Content>
        <div>
          <SC.Subtitle>Fast foward timestamp: </SC.Subtitle>
          <div>
            <button onClick={() => fastForward({ minutes: 1 })}>⏩ +1m</button>
            <button onClick={() => fastForward({ minutes: 30 })}>⏩ +30m</button>
            <button onClick={() => fastForward({ hours: 1 })}>⏩ +1h</button>
            <button onClick={() => fastForward({ days: 1 })}>⏩ +24h</button>
            <button onClick={() => fastForward({ days: 3 })}>⏩ +3d</button>
          </div>

          <SC.Subtitle>Last block timestamp:</SC.Subtitle>
          <SC.Text>{formatTimestamp(latestBlockTimestamp)}</SC.Text>
          <SC.Subtitle>Next block timestamp:</SC.Subtitle>
          <SC.Subtitle>total amount: {virtualFloor.totalSupply}</SC.Subtitle>
          <SC.Text>{formatTimestamp(nextBlockTimestamp)}</SC.Text>

          {canCommit && (
            <>
              <SC.Subtitle>Commited Bets: </SC.Subtitle>
              <SC.Section>
                {commits.map((commit, index) => (
                  <SC.BetCard key={index}>
                    <SC.Value>Amount: {commit.amount}</SC.Value>
                    <SC.Value>
                      Outcomes: {commit.outcomeIndexes.map((outcome, i) => `${i !== 0 ? ", " : " "}${outcome}`)}
                    </SC.Value>
                  </SC.BetCard>
                ))}
              </SC.Section>

              <SC.Subtitle>Commit bets: </SC.Subtitle>
              <SC.Section>
                <SC.CommitBetsBtn onClick={commitToVirtualFloor}>Commit</SC.CommitBetsBtn>
              </SC.Section>
            </>
          )}
        </div>
        <div>
          <SC.Subtitle>💵 USDT balance: </SC.Subtitle>
          <SC.Text>$ {userBalance}</SC.Text>

          {
            virtualFloor.winningOutcome && (
              <>
                <SC.Subtitle>Total Fee rate: {virtualFloor.totalFeeRate}</SC.Subtitle>
                <SC.Subtitle>Winning Outcome: {virtualFloor.winningOutcome.index}</SC.Subtitle>
               
                <SC.Subtitle>Claim Rewards </SC.Subtitle>
                <SC.Section>
                  <SC.CommitBetsBtn onClick={claim}>{claimButtonText()}</SC.CommitBetsBtn>
                </SC.Section>
              </>
            )
          }
          
          {canCommit && (
            <>
              <SC.Subtitle>Bets List (still need to commit): </SC.Subtitle>
              <SC.Section>
                {commits.map((commit, index) => (
                  <SC.BetCard key={index}>
                    <SC.Value>Amount: {commit.amount}</SC.Value>
                    <SC.Value>
                      Outcomes: {commit.outcomeIndexes.map((outcome, i) => `${i !== 0 ? ", " : " "}${outcome}`)}
                    </SC.Value>
                    <button onClick={() => handleRemoveBet(index)}>Remove bet</button>
                  </SC.BetCard>
                ))}
              </SC.Section>

              <SC.Subtitle>Place new bet: </SC.Subtitle>
              <SC.Section>
                <div>
                  <SC.Value>
                    Selected Outcomes:
                    {currentOutcomeIndexes.map((outcome, i) => `${i !== 0 ? ", " : " "}${outcome}`)}
                  </SC.Value>
                  <SC.AmountInput type="number" value={amount} onChange={(e: any) => setAmount(Number(e.target.value))} />
                  <SC.PlaceBetBtn onClick={handlePlaceBet}>Confirm</SC.PlaceBetBtn>
                </div>
              </SC.Section>
            </>
          )}

          {canBeResolved && (
            <>
              <SC.Subtitle>Resolve Spin: </SC.Subtitle>
              <SC.Section>
                <SC.ResolveSpinBtn onClick={resolveRouletteSpin}>Resolve spin</SC.ResolveSpinBtn>
              </SC.Section>
            </>
          )}
        </div>
      </SC.Content>
      <br />
      <hr />
      <SC.Subtitle>Current Outcomes Balances: </SC.Subtitle>
      <SC.Section>
        {virtualFloor.outcomes.map((outcome, index) => (
          <SC.BetCard key={index}>
            <SC.Value>Outcome: {outcome.index} Amount: {outcome.totalSupply}</SC.Value>
          </SC.BetCard>
        ))}
      </SC.Section>

    </SC.Container>
  );
};

export default RouletteBetsManager;

