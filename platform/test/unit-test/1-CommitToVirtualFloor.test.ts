import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { BigNumber, BigNumberish } from 'ethers';
import { ethers } from 'hardhat';
import {
  $,
  DoubleDiceDeploymentHelper,
  DoubleDicePlatformHelper,
  ENCODED_DUMMY_METADATA,
  EvmCheckpoint,
  EvmHelper,
  findUserCommitmentEventArgs,
  generateRandomVirtualFloorId, SignerWithAddress,
  timestampMinuteCeil,
  toFp18,
  toTimestamp,
  UNSPECIFIED_COMMITMENT_DEADLINE
} from '../../helpers';
import {
  ClassicDoubleDiceApp,
  DoubleDiceProtocol,
  DummyUSDCoin, DummyWrappedBTC,
  VirtualFloorCreationParamsStruct,
  VirtualFloorState
} from '../../lib/contracts';

chai.use(chaiSubset);

let helper: DoubleDicePlatformHelper;

const totalFeeRate_e18 = 50000_000000_000000n; // 0.05 = 5%

describe('DoubleDice/Commit', function () {
  let ownerSigner: SignerWithAddress;
  let protocolFeeBeneficiarySigner: SignerWithAddress;
  let user1Signer: SignerWithAddress;
  let user2Signer: SignerWithAddress;
  let user3Signer: SignerWithAddress;
  let contract: DoubleDiceProtocol;
  let appContract: ClassicDoubleDiceApp;
  let token: DummyUSDCoin | DummyWrappedBTC;
  let paymentTokenAddress: string;
  let evm: EvmHelper;

  before(async function () {
    evm = new EvmHelper(ethers.provider);

    [
      ownerSigner,
      protocolFeeBeneficiarySigner,
      user1Signer,
      user2Signer,
      user3Signer,
    ] = await ethers.getSigners();

    const deploymentHelper = new DoubleDiceDeploymentHelper(ownerSigner);

    token = await deploymentHelper.deployDummyUSDCoin();

    await deploymentHelper.deployProxyAdmin();

    contract = await deploymentHelper.deployUpgradeableDoubleDiceProtocol({
      constructorArgs: [],
      initializerArgs: [{
        tokenMetadataUriTemplate: 'http://localhost:8080/token/{id}',
        protocolFeeRate_e18: toFp18(0.50),
        protocolFeeBeneficiary: protocolFeeBeneficiarySigner.address,
        contractURI: 'http://localhost:8080/contract-metadata.json'
      }]
    });

    appContract = await deploymentHelper.deployUpgradeableClassicDoubleDiceApp({
      constructorArgs: [contract.address, token.address],
      initializerArgs: [],
    });

    await deploymentHelper.setup({ protocol: contract, classicApp: appContract });

    expect(await contract.platformFeeRate_e18()).to.eq(500000_000000_000000n);

    helper = new DoubleDicePlatformHelper(contract, appContract);

    // Assert fee beneficiary
    expect(await contract.platformFeeBeneficiary()).to.eq(protocolFeeBeneficiarySigner.address);

    {
      expect(
        await contract.isPaymentTokenWhitelisted(token.address)
      ).to.be.false;
      await (
        await contract
          .connect(ownerSigner)
          .updatePaymentTokenWhitelist(token.address, true)
      ).wait();
      expect(
        await contract.isPaymentTokenWhitelisted(token.address)
      ).to.be.true;
      paymentTokenAddress = token.address;
    }
  });

  describe('Commit To Virtual Floor', function () {
    // Random virtual floor for each test case
    let vfId: BigNumberish;
    const tOpen = toTimestamp('2031-06-01T12:00:00');
    const tClose = toTimestamp('2032-01-01T12:00:00');
    const tResolve = toTimestamp('2032-01-02T00:00:00');
    const nOutcomes = 3;
    const betaOpen_e18 = BigNumber.from(10)
      .pow(18)
      .mul(13); // 1 unit per hour

    const outcomeIndex = 0;
    const amount = $(10);

    let virtualFloorCreationParams: VirtualFloorCreationParamsStruct;

    beforeEach(async () => {
      // Mint 1000$ to each user
      await helper.mintTokensForUser({
        token,
        ownerSigner,
        userAddress: user1Signer.address,
        amount: $(1000),
      });
      await helper.mintTokensForUser({
        token,
        ownerSigner,
        userAddress: user2Signer.address,
        amount: $(1000),
      });
      await helper.mintTokensForUser({
        token,
        ownerSigner,
        userAddress: user3Signer.address,
        amount: $(1000),
      });

      // Allow the contract to transfer up to 100$ from each user
      await (
        await token.connect(user1Signer).approve(contract.address, $(100))
      ).wait();
      await (
        await token.connect(user2Signer).approve(contract.address, $(100))
      ).wait();
      await (
        await token.connect(user3Signer).approve(contract.address, $(100))
      ).wait();

      vfId = generateRandomVirtualFloorId();

      virtualFloorCreationParams = {
        vfId,
        betaOpen_e18,
        totalFeeRate_e18,
        tOpen,
        tClose,
        tResolve,
        nOutcomes,
        paymentToken: paymentTokenAddress,
        bonusAmount: 0,
        optionalMinCommitmentAmount: 0,
        optionalMaxCommitmentAmount: 0,
        metadata: ENCODED_DUMMY_METADATA,
        creator: ownerSigner.address,
      };

      await (
        await appContract.createVirtualFloor({
          ...virtualFloorCreationParams,
          paymentToken: paymentTokenAddress,
        })
      ).wait();
    });

    it('Should revert if vfId doesn’t exist', async function () {
      const randomVirtualFloorId = 0x000000000000000000000000000000000000_01_000000000000dead_00_00000000n;
      const outcomeIndex = 0;
      const amount = $(10);

      await expect(
        appContract
          .connect(user1Signer)
          .commitToVirtualFloor(randomVirtualFloorId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).to.be.revertedWith(`WrongVirtualFloorState(${VirtualFloorState.None})`);
    });

    it('Should revert if virtual Floor is closed', async function () {
      const checkpoint = await EvmCheckpoint.create();
      await evm.setNextBlockTimestamp('2032-01-01T13:00:00');

      await expect(
        appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).to.be.revertedWith(`WrongVirtualFloorState(${VirtualFloorState.Active_Closed_ResolvableNever})`);
      await checkpoint.revertTo();
    });

    it('Should revert if outcome index provided is out of options set for VF', async function () {
      const wrongOutComeIndex = 3;
      await expect(
        appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [wrongOutComeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).to.be.revertedWith('OutcomeIndexOutOfRange()');
    });

    it('Should revert if amount is zero', async function () {
      const wrongAmount = $(0);
      await expect(
        appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [wrongAmount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).to.be.revertedWith('CommitmentAmountOutOfRange()');
    });

    it('Should revert if enough allowance was not granted', async function () {
      const amountBiggerThanAllowance = $(200);
      await expect(
        appContract
          .connect(user1Signer)
          .commitToVirtualFloor(
            vfId,
            [outcomeIndex],
            [amountBiggerThanAllowance],
            UNSPECIFIED_COMMITMENT_DEADLINE
          )
      ).to.be.revertedWith('ERC20: insufficient allowance');
    });

    it('Should commit successfully if right parameters passed and as well emit right event with right parameters', async function () {
      const { logs } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();

      const userCommitmentEventArgs = findUserCommitmentEventArgs(contract, logs);

      expect(userCommitmentEventArgs.vfId).to.eq(vfId);
      expect(userCommitmentEventArgs.outcomeIndexes).to.eql([outcomeIndex]);
      expect(userCommitmentEventArgs.amounts).to.eql([amount]);
    });

    it('Should transfer the amount to the contract address', async function () {
      const balanceOfContractBeforeCommit = await token.balanceOf(
        contract.address
      );
      await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      const balanceOfContractAfterCommit = await token.balanceOf(
        contract.address
      );
      expect(
        balanceOfContractAfterCommit.sub(balanceOfContractBeforeCommit)
      ).to.be.eq(amount);
    });

    it('Should increase the VF aggregate commitment by the amount', async function () {
      const aggregateBalanceBeforeCommit = await contract.getVirtualFloorOutcomeTotals(
        vfId,
        outcomeIndex
      );
      await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      const aggregateBalanceAfterCommit = await contract.getVirtualFloorOutcomeTotals(
        vfId,
        outcomeIndex
      );
      expect(
        aggregateBalanceAfterCommit.amount.sub(
          aggregateBalanceBeforeCommit.amount
        )
      ).to.be.eq(amount);
    });

    it('Should generate same token ID if the commitment is before open time', async function () {
      const localCheckpoint = await EvmCheckpoint.create();

      await evm.setNextBlockTimestamp(tOpen - 10 * 60);

      const { logs: commitment1Logs } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      const commitment1EventArgs = findUserCommitmentEventArgs(contract, commitment1Logs);

      await evm.setNextBlockTimestamp(tOpen - 5 * 60);

      const { logs: commitment2Logs } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      const commitment2EventArgs = findUserCommitmentEventArgs(contract, commitment2Logs);

      expect(commitment2EventArgs.tokenIds).to.be.eql(
        commitment1EventArgs.tokenIds
      );

      await localCheckpoint.revertTo();
    });

    it('Should generate unique token id for the granularity level of time slot duration after open time', async function () {
      const vfId1 = generateRandomVirtualFloorId();

      const { timestamp } = await ethers.provider.getBlock('latest');

      const _tOpen = timestampMinuteCeil(timestamp + 60);
      const tCommitment1 = timestampMinuteCeil(_tOpen + 3 * 60);
      const tCommitment2 = timestampMinuteCeil(_tOpen + 6 * 60);

      await (
        await appContract.createVirtualFloor({
          ...virtualFloorCreationParams,
          vfId: vfId1,
          tOpen: _tOpen,
          paymentToken: paymentTokenAddress,
        })
      ).wait();


      await evm.setNextBlockTimestamp(tCommitment1);

      const { logs: commitment1Logs, blockHash: blockHash1 } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId1, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      const commitment1EventArgs = findUserCommitmentEventArgs(contract, commitment1Logs);

      expect((await ethers.provider.getBlock(blockHash1)).timestamp).to.eq(tCommitment1);


      await evm.setNextBlockTimestamp(tCommitment2);

      const { logs: commitment2Logs, blockHash: blockHash2 } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId1, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      const commitment2EventArgs = findUserCommitmentEventArgs(contract, commitment2Logs);

      expect((await ethers.provider.getBlock(blockHash2)).timestamp).to.eq(tCommitment2);


      expect(commitment2EventArgs.tokenIds).to.be.not.eql(
        [commitment1EventArgs.tokenIds]
      );
    });

    it('Should revert if the amount passed is more than the limit uint256', async function () {
      const amountExceedUint256Limit = 2n ** 256n + 1n;

      await expect(
        appContract
          .connect(user1Signer)
          .commitToVirtualFloor(
            vfId,
            [outcomeIndex],
            [amountExceedUint256Limit],
            UNSPECIFIED_COMMITMENT_DEADLINE
          )
      ).to.be.reverted;
    });

    it('Should revert if the weighted amount passed the max limit of uint256', async function () {
      const amountExceedUint256Limit = 2n ** 256n;

      await expect(
        appContract
          .connect(user1Signer)
          .commitToVirtualFloor(
            vfId,
            [outcomeIndex],
            [amountExceedUint256Limit],
            UNSPECIFIED_COMMITMENT_DEADLINE
          )
      ).to.be.reverted;
    });

    it('Should mint token commitment for the user', async function () {
      const { logs } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [outcomeIndex], [amount], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      const userCommitmentEventArgs = findUserCommitmentEventArgs(contract, logs);

      const mintedTokenAmount = await contract.balanceOf(
        user1Signer.address,
        userCommitmentEventArgs.tokenIds[0]
      );
      expect(mintedTokenAmount).to.be.eq(amount);
    });
  });
});
