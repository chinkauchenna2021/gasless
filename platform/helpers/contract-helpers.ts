import {
  BigNumber,
  BigNumberish,
  ContractReceipt,
  Signer
} from 'ethers';
import { ethers } from 'hardhat';
import {
  findUserCommitmentEventArgs,
  findVfResolutionsEventArgs,
  SignerWithAddress,
  UserCommitment,
  VirtualFloorResolutions
} from '.';
import {
  ClassicDoubleDiceApp,
  DoubleDiceProtocol,
  DummyUSDCoin,
  DummyWrappedBTC
} from '../lib/contracts';
import { EvmHelper } from './evm';

type AddressOrSigner = string | SignerWithAddress;

export const toAddress = (addressOrSigner: AddressOrSigner) => typeof addressOrSigner === 'string' ? addressOrSigner : addressOrSigner.address;

// ToDo: Move into Helper class, use provider supplied to its constructor
const evm = new EvmHelper(ethers.provider);

export class DoubleDicePlatformHelper {
  constructor(private ddProtocol: DoubleDiceProtocol, private dd: ClassicDoubleDiceApp) { }

  balanceOf(addressOrSigner: string, tokenId: string): Promise<BigNumber> {
    return this.ddProtocol.balanceOf(addressOrSigner, tokenId);
  }

  async mintTokensForUser({
    token,
    ownerSigner,
    userAddress,
    amount,
  }: {
    token: DummyUSDCoin | DummyWrappedBTC;
    ownerSigner: SignerWithAddress;
    userAddress: string;
    amount: BigNumber;
  }) {
    return await (
      await token.connect(ownerSigner).mint(userAddress, amount)
    ).wait();
  }
  async mintTokenAndGiveAllowanceToContract({
    token,
    ownerSigner,
    usersSigner,
    mintAmount,
    allowanceAmount,
    contractAddress,
  }: {
    token: DummyUSDCoin | DummyWrappedBTC;
    ownerSigner: SignerWithAddress;
    usersSigner: SignerWithAddress[];
    mintAmount: BigNumber;
    allowanceAmount: BigNumber;
    contractAddress: string;
  }) {
    for (const userSigner of usersSigner) {
      await (
        await token.connect(userSigner).approve(contractAddress, allowanceAmount)
      ).wait();

      await (
        await token.connect(ownerSigner).mint(toAddress(userSigner), mintAmount)
      ).wait();
    }
  }

  // async createVirtualFloor(
  //   virtualFloorCreationParams: VirtualFloorCreationParamsStruct
  // ) {
  //   return await (
  //     await this.contract.createVirtualFloor(virtualFloorCreationParams)
  //   ).wait();
  // }

  async commitToVirtualFloor(
    vfId: BigNumberish,
    outcomeIndexes: number[],
    userSigner: SignerWithAddress,
    amounts: BigNumberish[],
    deadline: BigNumberish,
  ): Promise<UserCommitment> {
    const { logs } = await (
      await this.dd
        .connect(userSigner)
        .commitToVirtualFloor(vfId, outcomeIndexes, amounts, deadline)
    ).wait();

    return findUserCommitmentEventArgs(this.ddProtocol, logs) as UserCommitment;
  }

  async resolveVirtualFloor(
    vfId: BigNumberish,
    outcomeIndex: number,
    ownerSigner: SignerWithAddress
  ): Promise<VirtualFloorResolutions> {
    const { logs } = await (
      await this.dd
        .connect(ownerSigner)
        .setResult(vfId, outcomeIndex)
    ).wait();

    return findVfResolutionsEventArgs(this.ddProtocol, logs) as VirtualFloorResolutions;
  }

  async setResultThenLaterConfirmUnchallengedResult(signer: Signer, ...[vfId, ...otherArgs]: Parameters<ClassicDoubleDiceApp['setResult']>): Promise<[VirtualFloorResolutions, ContractReceipt, ContractReceipt]> {
    const rx1 = await (await this.dd.connect(signer).setResult(vfId, ...otherArgs)).wait();

    // ToDo: Contract should store tChallengeMax directly, instead of storing setTimestamp
    const { tResultChallengeMax } = await this.dd.resolutions(vfId);
    const CHALLENGE_WINDOW_DURATION = await this.dd.CHALLENGE_WINDOW_DURATION();
    const tChallengeMax = BigNumber.from(tResultChallengeMax).add(CHALLENGE_WINDOW_DURATION);

    await evm.setNextBlockTimestamp(tChallengeMax);

    const rx2 = await (await this.dd.connect(signer).confirmUnchallengedResult(vfId)).wait();

    const vfResolutionsEvent = findVfResolutionsEventArgs(this.ddProtocol, rx2.logs);

    return [vfResolutionsEvent, rx1, rx2];
  }

  async claimPayouts(userSigner: Signer, ...args: Parameters<DoubleDiceProtocol['claimPayouts']>): Promise<ContractReceipt> {
    return await (await this.ddProtocol.connect(userSigner).claimPayouts(...args)).wait();
  }
}
