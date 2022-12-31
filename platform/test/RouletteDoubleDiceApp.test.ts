import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import assert from 'assert';
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  $,
  DoubleDiceDeploymentHelper,
  EvmHelper,
  findContractEventArgs,
  getRouletteRoundDiffInMilliseconds,
  sumOf,
  toFp18,
  UNSPECIFIED_COMMITMENT_DEADLINE
} from '../helpers';
import {
  RouletteDoubleDiceApp,
  DoubleDiceProtocol,
  DummyUSDCoin,
  DummyLinkToken,
  VRFCoordinatorV2Mock,
  VirtualFloorState
} from '../lib/contracts';
import { RouletteSessionCreationParamsStruct } from '../lib/generated/typechain-types/artifacts/contracts/app/roulette/RouletteDoubleDiceApp';
import { setupSnapshotHooks, waitForAllTxs } from './helpers';

chai.use(chaiSubset);

// Emulate what goes on in the contracts
const emulateRng = (requestId: BigNumber, nOutcomes: BigNumber): number => {
  // node_modules/@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol
  // words[i] = uint256(keccak256(abi.encode(_requestId, i)));
  const word0 = BigNumber.from(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], [requestId, 0])));

  return word0.mod(nOutcomes).toNumber();
};

const callbackGasLimit = 300_000;
const keyHash = ethers.constants.HashZero;
const subscriptionId = BigNumber.from(1);
const minRequestConfirmations = BigNumber.from(3);
 
describe('DoubleDice/Roulette', () => {

  let evm: EvmHelper;
  let deployer: SignerWithAddress;
  let platformFeeBeneficiary: SignerWithAddress;
  let user0: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  let user5: SignerWithAddress;
  let chainlinkSubscriptionOwner: SignerWithAddress;
  let autotask: SignerWithAddress;
  let chainlinkFulfiller: SignerWithAddress;
  let protocol: DoubleDiceProtocol;
  let appContract: RouletteDoubleDiceApp;
  let vrfCoordinatorMock: VRFCoordinatorV2Mock;
  let paymentToken: DummyUSDCoin;
  let linkToken: DummyLinkToken;
  let sessionParams: RouletteSessionCreationParamsStruct;
  let users: SignerWithAddress[];

  const THIRTY_DAYS = 2592000;
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const NEXT_THIRTY_DAYS = (currentTime + THIRTY_DAYS);
  const NEXT_SIXTY_DAYS = (currentTime + (THIRTY_DAYS * 2));
  const MAX_PAYMENT_TOKEN_PER_USER = $(500);

  before(async () => {
    evm = new EvmHelper(ethers.provider);

    [
      deployer,
      platformFeeBeneficiary,
      user0, user1, user2, user3, user4, user5,
      chainlinkSubscriptionOwner,
      autotask,
      chainlinkFulfiller,
    ] = await ethers.getSigners();

    const helper = new DoubleDiceDeploymentHelper(deployer);

    paymentToken = await helper.deployDummyUSDCoin();
    linkToken = await helper.deployDummyLinkToken();

    await helper.deployProxyAdmin();

    protocol = await helper.deployUpgradeableDoubleDiceProtocol({
      constructorArgs: [],
      initializerArgs: [{
        tokenMetadataUriTemplate: 'http://localhost:8080/token/{id}',
        protocolFeeRate_e18: toFp18(0.25),
        protocolFeeBeneficiary: platformFeeBeneficiary.address,
        contractURI: 'http://localhost:8080/contract-metadata.json'
      }]
    });

    vrfCoordinatorMock = await helper.deployVRFCoordinatorV2Mock();

    appContract = await helper.deployUpgradeableRouletteDoubleDiceApp({
      constructorArgs: [protocol.address, {
        vrfCoordinator: vrfCoordinatorMock.address,
        keyHash,
        subId: subscriptionId,
        minRequestConfirmations,
        callbackGasLimit,
        linkToken: linkToken.address
      },"0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d"],
      initializerArgs: []
    });

    await helper.setup({ protocol, rouletteApp: appContract });

    await (await protocol.updatePaymentTokenWhitelist(paymentToken.address, true)).wait();    

    users = [user0, user1, user2, user3, user4, user5];

    await waitForAllTxs(users.map(user => paymentToken.connect(deployer).mint(user.address, MAX_PAYMENT_TOKEN_PER_USER)));
    await waitForAllTxs(users.map(user => paymentToken.connect(user).approve(protocol.address, MAX_PAYMENT_TOKEN_PER_USER)));

  });

  beforeEach(() => {
    const vfIds: string[] = [];
    const bonusAmounts: number[] = [];

    for (let i = 0 ; i < 5 ; i ++) {
      const vfId = ethers.utils.hexConcat([
        '0x01',
        ethers.utils.hexlify(ethers.utils.randomBytes(8)),
        '0x00',
        '0x00000000',
      ]);
  
      vfIds.push(vfId);
      bonusAmounts.push(0);
    }

    sessionParams = {
      vfIds,
      paymentToken: paymentToken.address,
      totalFeeRate_e18: 50000_000000_000000n, // = 0.05 = 5.00%
      bonusAmounts,
      tOpen: NEXT_THIRTY_DAYS,
      tResolve: NEXT_SIXTY_DAYS,
      nOutcomes: BigNumber.from(37),
      optionalMinCommitmentAmount: $(1),
      optionalMaxCommitmentAmount: $(100),
      metadata: {
        version: '0x0000000000000000000000000000000000000000000000000000000000000001',
        data: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000057469746c650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008726f756c65747465000000000000000000000000000000000000000000000000'
      }
    };
  });

  setupSnapshotHooks();

  describe('Check contract deployment', () => {
    it('should check chainlink configuration params', async () => {
      expect(await appContract.connect(deployer).getKeyHash()).to.eq(keyHash);
      expect(await appContract.connect(deployer).getSubscriptionId()).to.eq(subscriptionId);
    });
  });

  describe('Create roulette session', () => {
    it('should revert when virtual floor ids is not equal to the bonus amount length', async () => {
      const params = sessionParams;
      params.bonusAmounts.pop();
      await expect(
        appContract.connect(deployer).createRouletteSession(params)
      ).to.be.revertedWith('BonusAmountAndVfIdMismatch()');
    });

    it('should revert when virtual floor length is 0', async () => {
      const params = sessionParams;
      params.vfIds.length = 0;
      await expect(
        appContract.connect(deployer).createRouletteSession(params)
      ).to.be.revertedWith('InvalidNumRounds()');
    });

    it('should revert link token is not provided and rng fee is set', async () => {
      await appContract.connect(deployer).setRngFee(BigNumber.from(10));

      await expect(
        appContract.connect(deployer).createRouletteSession(sessionParams)
      ).to.be.reverted;
    });

    it('should check successful session creation', async () => {

      const tx = await appContract.connect(deployer).createRouletteSession(sessionParams);

      const roundMilliseconds = getRouletteRoundDiffInMilliseconds(sessionParams.tResolve, sessionParams.tOpen, sessionParams.vfIds.length);

      for (let i = 0; i < sessionParams.vfIds.length; i++) {
        const spin = await protocol.getVirtualFloorParams(sessionParams.vfIds[i]);

        const tResolve = BigNumber.from(sessionParams.tOpen).add(roundMilliseconds.mul(BigNumber.from(i + 1)));
        const tOpen = tResolve.sub(BigNumber.from(roundMilliseconds));

        expect(spin.tOpen).to.eq(tOpen);
        expect(spin.tResolve).to.eq(tResolve);
        expect(spin.bonusAmount).to.eq(sessionParams.bonusAmounts[i]);
        expect(spin.minCommitmentAmount).to.eq(sessionParams.optionalMinCommitmentAmount);
        expect(spin.maxCommitmentAmount).to.eq(sessionParams.optionalMaxCommitmentAmount);
      }
      
      expect(await appContract.connect(deployer).getCurrentTableId()).to.eq(BigNumber.from(1));

      const contractReceipt = await tx.wait();
      const sessionCreationEventLogs = findContractEventArgs(appContract, contractReceipt.logs, 'RouletteSessionCreation');

      expect(sessionCreationEventLogs.tableId).to.eq(BigNumber.from(1));
      expect(sessionCreationEventLogs.tResolve).to.eq(sessionParams.tResolve);
      expect(sessionCreationEventLogs.tOpen).to.eq(sessionParams.tOpen);
    });

  });

  describe('commitToVirtualFloor', () => { 
    it('should revert when there is mismatch between outcome and amount', async () => {
      const vfId = sessionParams.vfIds[0];
      const outcomeIndexes = [BigNumber.from(25), BigNumber.from(25)];
      const amounts = [$(2)];

      await appContract.connect(deployer).createRouletteSession(sessionParams);

      await expect(
        appContract.connect(user0).commitToVirtualFloor(vfId, outcomeIndexes, amounts, UNSPECIFIED_COMMITMENT_DEADLINE)
      ).to.be.revertedWith('CommitmentMisMatch()');
    });

    it('should successful commitment', async () => {
      const vfId = sessionParams.vfIds[0];
      const outcomeIndexes = [BigNumber.from(25), BigNumber.from(0)];
      const amounts = [$(1), $(1)];

      await appContract.connect(deployer).createRouletteSession(sessionParams);

      const receipts = await appContract.connect(user0).commitToVirtualFloor(vfId, outcomeIndexes, amounts, UNSPECIFIED_COMMITMENT_DEADLINE);

      expect(await paymentToken.balanceOf(protocol.address)).to.eq(sumOf(...amounts));
      
      const contractReceipt = await receipts.wait();
      
      const eventLogs = findContractEventArgs(protocol, contractReceipt.logs, 'UserCommitment');
      
      expect(eventLogs.tokenIds.length).to.eq(outcomeIndexes.length);

    });
  });

  describe('resolveVirtualFloor', () => {
    it('should create and resolve a spin', async () => {
      const vfId = sessionParams.vfIds[0];
      const commitmentAmounts = $(10);

      await appContract.connect(deployer).createRouletteSession(sessionParams);

      const receipts = await waitForAllTxs(users.map((user, i) => appContract.connect(user).commitToVirtualFloor(vfId, [20 + i], [commitmentAmounts], UNSPECIFIED_COMMITMENT_DEADLINE)));

      const userTokenIds = receipts.map(({ logs }) => findContractEventArgs<{ tokenIds: BigNumber[] }>(protocol, logs, 'UserCommitment').tokenIds);

      const timeDiff = getRouletteRoundDiffInMilliseconds(sessionParams.tResolve, sessionParams.tOpen, sessionParams.vfIds.length);

      await evm.setNextBlockTimestamp(BigNumber.from(sessionParams.tOpen).add(timeDiff));

      {
        const { events } = await (await vrfCoordinatorMock.connect(chainlinkSubscriptionOwner).createSubscription()).wait();
        assert(Array.isArray(events));
        expect(events).to.have.lengthOf(1);
        expect(events[0].event).to.eq('SubscriptionCreated');
        expect(events[0]?.args?.subId).to.eq(1);
      }

      const { logs: resolveLogs } = await (await appContract.connect(autotask).resolveVirtualFloor(vfId)).wait();
      const { requestId, sender: consumer } = findContractEventArgs(vrfCoordinatorMock, resolveLogs, 'RandomWordsRequested');

      const expectedOutcomeIndex = BigNumber.from(5);

      // Emulate the contract RNG process
      expect(emulateRng(requestId, BigNumber.from(36))).to.eq(expectedOutcomeIndex);

      const balancesBefore = await Promise.all(users.map(user => paymentToken.balanceOf(user.address)));
      expect(balancesBefore.every(value => value.eq(MAX_PAYMENT_TOKEN_PER_USER.sub(commitmentAmounts)))).to.be.true;

      await (await vrfCoordinatorMock.connect(chainlinkFulfiller).fulfillRandomWords(requestId, consumer, { gasLimit: 10 * callbackGasLimit })).wait();

      const vfState = await protocol.getVirtualFloorState(vfId);
      
      if (vfState === VirtualFloorState.Claimable_Payouts) {                
        await waitForAllTxs(users.map((user, i) => protocol.connect(user).claimPayouts(vfId, [...userTokenIds[i]])));

        //   const balancesAfter = await Promise.all(users.map(user => paymentToken.balanceOf(user.address)));
        //   expect(balancesAfter[0]).to.eq(0);
        //   expect(balancesAfter[1]).to.eq(0);
        //   expect(balancesAfter[2]).to.eq(0);
        //   expect(balancesAfter[3]).to.eq(1026_000000n); // 95% of 600$, since totalFeeRate is fixed at 5% for this game
        //   expect(balancesAfter[4]).to.eq(0);
        //   expect(balancesAfter[5]).to.eq(0); 

      }

    });

  });

});