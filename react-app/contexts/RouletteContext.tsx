import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { BigNumber, BigNumberish } from "ethers";
import type { RouletteSessionCreationParamsStruct } from "lib/generated/typechain-types/artifacts/contracts/app/roulette/RouletteDoubleDiceApp";
import { $ } from "utils/helpers";
import {
  claimPayouts,
  commitToSpin,
  CommitToSpinParams,
  createSession,
  getVirtualFloorState,
  resolveSpin,
} from "web3Api/rouletteContract";

import { useAccount } from "./AccountContext";

interface BetProps {
  outcomeIndexes: number[];
  amount: number;
}

interface ResolvedVfProps {
  vfId: BigNumberish;
  roundNum: number;
  hasReward: boolean;
  claimedReward: boolean;
}

interface RouletteProps {
  currentRound: number;
  bets: BetProps[];
  commitedBets: BetProps[];
  optionalDeadline: BigNumberish;
  resolvedVfs: ResolvedVfProps[];
}
interface VfIdTokenIdsProps {
  [vfId: string]: BigNumber[];
}

interface RouletteContextData {
  createRouletteSession(rouletteCreationParams: RouletteSessionCreationParamsStruct): Promise<void>;
  joinRouletteSession(sessionId: string | number, vfIds: string[], currentRoundNum: number): Promise<void>;
  addBetToList(bet: BetProps): void;
  removeBetFromList(betId: string): void;
  commitBetList(): Promise<void>;
  resolveRouletteSpin(): Promise<void>;
  getVfState(): Promise<number>;
  claimRewards(vfId: BigNumberish): Promise<void>;
  bets: BetProps[];
  commitedBets: BetProps[];
  resolvedVfs: ResolvedVfProps[];
  currentOutcomeIndexes: number[];
  setCurrentOutcomeIndexes: (CurrentOutcomeIndexes: number[]) => void;
}

const RouletteContext = createContext<RouletteContextData>({} as RouletteContextData);

interface RouletteProviderProps {
  children: React.ReactNode;
}

const RouletteProvider: React.FC<RouletteProviderProps> = ({ children }) => {
  const [roulette, setRoulette] = useState<RouletteProps>({
    currentRound: 0,
    bets: [],
    commitedBets: [],
    resolvedVfs: [],
    optionalDeadline: 0,
  } as RouletteProps);
  const [currentOutcomeIndexes, setCurrentOutcomeIndexes] = useState<number[]>([]);
  const [vfIdToTokenIds, setVfIdToTokenIds] = useState<VfIdTokenIdsProps>({} as VfIdTokenIdsProps);
  const [vfIds, setVfIds] = useState<string[]>([]);
  const { signer } = useAccount();

  const createRouletteSession = useCallback(
    async (rouletteCreationParams: RouletteSessionCreationParamsStruct) => {
      try {
        const tx = await createSession(signer, rouletteCreationParams);

        await tx?.wait();

        const vfIdList: string[] = rouletteCreationParams.vfIds.map((vfId) => BigNumber.from(vfId).toString());

        setVfIds(vfIdList);
        setRoulette((prevState) => ({
          ...prevState,
          vfId: vfIdList[0],
          currentRound: 1,
        }));
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    [signer]
  );

  const joinRouletteSession = useCallback(async (sessionId: string | number, vfIds: string[], currentRound: number) => {
    setVfIds(vfIds);
    setRoulette((prevState) => ({
      ...prevState,
      vfId: sessionId,
      currentRound,
    }));
  }, []);

  const resolveRouletteSpin = useCallback(async (vfId: string) => {
    if (!vfId) {
      alert("VF not found");
      return;
    }

    if (!signer) return;

    try {
      const tx = await resolveSpin(signer, vfId);

      await tx?.wait();

      const currentVfIndex = vfIds.findIndex((vfId) => vfId === roulette.vfId);
      const nextVfIndex = currentVfIndex + 1;

      const newRouletteAttributes = {
        ...roulette,
        resolvedVfs: [
          ...roulette.resolvedVfs,
          {
            roundNum: roulette.currentRound,
            hasReward: true, // todo: get this info from the contract
            claimedReward: false,
          },
        ],
      };

      // checks if the array contains more vfIds and replace it with the next vf id
      if (nextVfIndex < vfIds.length) {
        setRoulette({
          ...newRouletteAttributes,
          commitedBets: [],
          currentRound: roulette.currentRound + 1,
        });
      } else {
        setRoulette(newRouletteAttributes);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, [signer, roulette.vfId, vfIds]);

  const addBetToList = useCallback(
    (bet: BetProps) => {
      setRoulette((prevState) => ({ ...prevState, bets: [...prevState.bets, bet] }));
    },
    []
  );

  const removeBetFromList = useCallback(
    (betId: string) => {
      if (!roulette.vfId) return;

      setRoulette((prevState) => ({ ...prevState, bets: prevState.bets.filter((bet) => bet.id !== betId) }));
    },
    [roulette.vfId]
  );

  const commitBetList = useCallback(async () => {
    if (!signer) return;

    try {
      const outcomeIndexes: BigNumber[] = [];
      const amounts: BigNumber[] = [];

      for (const bet of roulette.bets) {
        const dividedAmount = Math.floor((bet.amount / bet.outcomeIndexes.length) * 10) / 10;
        const dividedAmountInteger = Number(String(dividedAmount).split(".")[0]);
        const dividedAmountDecimals = Number((dividedAmount % 1).toFixed(6).substring(2));

        for (let i = 0; i < bet.outcomeIndexes.length; i++) {
          outcomeIndexes.push(BigNumber.from(bet.outcomeIndexes[i]));

          amounts.push($(dividedAmountInteger, dividedAmountDecimals));
        }
      }

      const multCommit: CommitToSpinParams = {
        outcomeIndexes,
        amounts,
        optionalDeadline: roulette.optionalDeadline, // todo: get optionalDeadline
      };

      const [, userTokenIds] = await commitToSpin(signer, multCommit);

      if (userTokenIds) {
        setVfIdToTokenIds((prevState) => ({ ...prevState, [String(roulette.vfId)]: userTokenIds }));
      }

      setRoulette((prevState) => ({
        ...prevState,
        bets: [],
        commitedBets: [...prevState.bets, ...prevState.commitedBets],
      }));
    } catch (err) {
      alert(err);
    }
  }, [signer, roulette]);

  const getVfState = useCallback(async () => {
    if (!signer || !roulette.vfId) return;

    return getVirtualFloorState(signer, roulette.vfId);
  }, [signer, roulette.vfId]);

  const claimRewards = useCallback(
    async (vfId: BigNumberish) => {
      try {
        await claimPayouts(signer, vfId, vfIdToTokenIds[String(vfId)]);
      } catch (err) {
        alert("No rewards found");
      }
      setRoulette((prevState) => ({
        ...prevState,
        resolvedVfs: prevState.resolvedVfs.filter((resolvedVf) => resolvedVf.vfId !== vfId),
      }));
    },
    [signer, vfIdToTokenIds]
  );

  const contextValue = useMemo(
    () => ({
      createRouletteSession,
      addBetToList,
      removeBetFromList,
      commitBetList,
      bets: roulette.bets,
      commitedBets: roulette.commitedBets,
      currentRound: roulette.currentRound,
      resolvedVfs: roulette.resolvedVfs,
      currentOutcomeIndexes,
      setCurrentOutcomeIndexes,
      resolveRouletteSpin,
      getVfState,
      claimRewards,
      joinRouletteSession,
    }),
    [
      createRouletteSession,
      addBetToList,
      removeBetFromList,
      commitBetList,
      roulette.resolvedVfs,
      roulette.bets,
      roulette.commitedBets,
      roulette.currentRound,
      currentOutcomeIndexes,
      setCurrentOutcomeIndexes,
      resolveRouletteSpin,
      getVfState,
      claimRewards,
      joinRouletteSession,
    ]
  );

  return <RouletteContext.Provider value={contextValue}>{children}</RouletteContext.Provider>;
};

export const useRoulette = (): RouletteContextData => {
  const context = useContext(RouletteContext);

  return context;
};

export default RouletteProvider;
