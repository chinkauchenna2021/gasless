import {
  DoubleDiceProtocol__factory,
  DummyUSDCoin__factory,
  RouletteDoubleDiceApp__factory,
  VRFCoordinatorV2Mock__factory,
} from "@doubledice/platform/lib/contracts";
import { RouletteSessionCreationParamsStruct } from "@doubledice/platform/lib/generated/typechain-types/artifacts/contracts/app/roulette/RouletteDoubleDiceApp";
import { TransactionResponse } from "@ethersproject/providers";
import networkConfig from "config/networkConfig";
import { BigNumber, BigNumberish } from "ethers";
import parseReceiptEvents from "utils/parseReceiptEvents";

export const createSession = async (
  signer: any,
  params: RouletteSessionCreationParamsStruct
): Promise<TransactionResponse | null> => {
  const rouletteContract = RouletteDoubleDiceApp__factory.connect(networkConfig.rouletteContractAddress, signer);

  const tx = await rouletteContract.createRouletteSession({
    vfIds: params.vfIds,
    paymentToken: params.paymentToken,
    totalFeeRate_e18: params.totalFeeRate_e18,
    bonusAmounts: params.bonusAmounts,
    tOpen: params.tOpen,
    tResolve: params.tResolve,
    nOutcomes: params.nOutcomes,
    optionalMinCommitmentAmount: params.optionalMinCommitmentAmount,
    optionalMaxCommitmentAmount: params.optionalMaxCommitmentAmount,
    metadata: params.metadata,
  });

  if (tx) {
    return tx;
  }

  return null;
};

export interface CommitToSpinParams {
  vfId: BigNumberish;
  outcomeIndexes: BigNumberish[];
  amounts: BigNumberish[];
  optionalDeadline: BigNumberish;
}

export const commitToSpin = async (
  signer: any,
  params: CommitToSpinParams
): Promise<string | null> => {
  const rouletteContract = RouletteDoubleDiceApp__factory.connect(networkConfig.rouletteContractAddress, signer);
  // const protocolContract = DoubleDiceProtocol__factory.connect(networkConfig.platformContractAddress, signer);

  const tx = await rouletteContract.commitToVirtualFloor(
    params.vfId,
    params.outcomeIndexes,
    params.amounts,
    params.optionalDeadline
  );

  const receipt = await tx.wait();
  // const receiptEvents = parseReceiptEvents(protocolContract.interface, receipt);

  // const userTokenIds: BigNumber[] = receiptEvents.UserCommitment.tokenIds;

  if (receipt) {
    return receipt.blockHash;
  }

  return null;
};

export const getUsdcBalance = async (signer: any): Promise<number> => {
  const dummyUsdcContract = DummyUSDCoin__factory.connect(networkConfig.dummyUsdcContractAddress, signer);

  const userAddress = signer?.getAddress();

  return (await dummyUsdcContract.balanceOf(userAddress)).toNumber() / 1000000;
};

export const getVirtualFloorState = async (signer: any, vfId: BigNumberish) => {
  const protocolContract = DoubleDiceProtocol__factory.connect(networkConfig.platformContractAddress, signer);

  return protocolContract.getVirtualFloorState(vfId);
};

export const resolveSpin = async (signer: any, vfId: BigNumberish): Promise<any> => {
  const rouletteContract = RouletteDoubleDiceApp__factory.connect(networkConfig.rouletteContractAddress, signer);
  const vrfCoordinatorContract = VRFCoordinatorV2Mock__factory.connect(
    networkConfig.vrfCoordinatorContractAddress,
    signer
  );

  const receipt = await (await rouletteContract.resolveVirtualFloor(vfId)).wait();
  const receiptEvents = parseReceiptEvents(vrfCoordinatorContract.interface, receipt);
  const callbackGasLimit = 300_000;

  await (
    await vrfCoordinatorContract.fulfillRandomWords(
      receiptEvents.RandomWordsRequested.requestId,
      networkConfig.rouletteContractAddress,
      {
        gasLimit: 10 * callbackGasLimit,
      }
    )
  ).wait();

  const newState = await getVirtualFloorState(signer, vfId);

  console.log({ newState });
};

export const claimPayouts = async (signer: any, vfId: BigNumberish, tokenIds: BigNumberish[]) => {
  const protocolContract = DoubleDiceProtocol__factory.connect(networkConfig.platformContractAddress, signer);

  return await protocolContract.claimPayouts(vfId, tokenIds);
};

export const claimRefunds = async (signer: any, vfId: BigNumberish, tokenIds: BigNumberish[]) => {
  const protocolContract = DoubleDiceProtocol__factory.connect(networkConfig.platformContractAddress, signer);

  return await protocolContract.claimRefunds(vfId, tokenIds);
};
