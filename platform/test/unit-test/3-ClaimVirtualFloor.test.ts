import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  $,
  DoubleDiceDeploymentHelper,
  DoubleDicePlatformHelper,
  ENCODED_DUMMY_METADATA,
  EvmCheckpoint,
  EvmHelper,
  findUserCommitmentEventArgs,
  generateRandomVirtualFloorId,
  SignerWithAddress,
  toFp18,
  tokenIdOf,
  toTimestamp,
  UNSPECIFIED_COMMITMENT_DEADLINE,
  UserCommitment
} from '../../helpers';
import {
  ClassicDoubleDiceApp,
  DoubleDiceProtocol,
  DummyUSDCoin, DummyWrappedBTC,
  VirtualFloorCreationParamsStruct,
  VirtualFloorState
} from '../../lib/contracts';

chai.use(chaiSubset);

// Used in places where the value itself is not important
const DUMMY_VF_ID = 0;

let helper: DoubleDicePlatformHelper;

const totalFeeRate_e18 = 50000_000000_000000n; // 0.05 = 5%

describe('DoubleDice/Claim', function () {
  let ownerSigner: SignerWithAddress;
  let protocolFeeBeneficiarySigner: SignerWithAddress;
  let user1Signer: SignerWithAddress;
  let user2Signer: SignerWithAddress;
  let user3Signer: SignerWithAddress;
  let user4Signer: SignerWithAddress;
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
      user4Signer,
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

  describe('Claim Virtual Floor', function () {
    // Random virtual floor for each test case
    const vfId = generateRandomVirtualFloorId();
    const vfId2 = generateRandomVirtualFloorId();
    const allWinnersVf = generateRandomVirtualFloorId();
    const betaOpen_e18 = BigNumber.from(10)
      .pow(18)
      .mul(13); // 1 unit per hour
    const tOpen = toTimestamp('2031-06-01T10:00:00');
    const tClose = toTimestamp('2032-01-01T10:00:00');
    const tResolve = toTimestamp('2032-01-02T00:00:00');
    const nOutcomes = 3;

    let user1CommitmentEventArgs: UserCommitment;
    let user2CommitmentEventArgs: UserCommitment;
    let user3CommitmentEventArgs: UserCommitment;
    const allWinnersVfCommitmentEventArgs: UserCommitment[] = [];

    let virtualFloorCreationParams: VirtualFloorCreationParamsStruct;

    before(async () => {
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

      // helper.mintTokenAndGiveAllowanceToContract({
      //
      // })

      // Mint 1000$ to each user
      await (
        await token.connect(ownerSigner).mint(user1Signer.address, $(1000))
      ).wait();
      await (
        await token.connect(ownerSigner).mint(user2Signer.address, $(1000))
      ).wait();
      await (
        await token.connect(ownerSigner).mint(user3Signer.address, $(1000))
      ).wait();

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

      await (
        await appContract.createVirtualFloor({
          ...virtualFloorCreationParams,
          paymentToken: paymentTokenAddress,
        })
      ).wait();
      await (
        await appContract.createVirtualFloor({
          ...virtualFloorCreationParams,
          vfId: vfId2,
          paymentToken: paymentTokenAddress,
        })
      ).wait();
      await (
        await appContract.createVirtualFloor({
          ...virtualFloorCreationParams,
          vfId: allWinnersVf,
          paymentToken: paymentTokenAddress,
        })
      ).wait();

      const { logs: user1CommittedLogs } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(vfId, [0], [$(10)], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      user1CommitmentEventArgs = findUserCommitmentEventArgs(contract, user1CommittedLogs);
      const { logs: user2CommittedLogs } = await (
        await appContract
          .connect(user2Signer)
          .commitToVirtualFloor(vfId, [1], [$(10)], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      user2CommitmentEventArgs = findUserCommitmentEventArgs(contract, user2CommittedLogs);
      const { logs: user3CommittedLogs } = await (
        await appContract
          .connect(user3Signer)
          .commitToVirtualFloor(vfId, [1], [$(10)], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      user3CommitmentEventArgs = findUserCommitmentEventArgs(contract, user3CommittedLogs);

      const { logs: user1AllWinCommittedLogs } = await (
        await appContract
          .connect(user1Signer)
          .commitToVirtualFloor(allWinnersVf, [1], [$(10)], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      allWinnersVfCommitmentEventArgs[0] = findUserCommitmentEventArgs(contract, user1AllWinCommittedLogs);
      await (
        await appContract
          .connect(user2Signer)
          .commitToVirtualFloor(allWinnersVf, [1], [$(10)], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
      await (
        await appContract
          .connect(user3Signer)
          .commitToVirtualFloor(allWinnersVf, [1], [$(10)], UNSPECIFIED_COMMITMENT_DEADLINE)
      ).wait();
    });

    it('Should revert if VF does not exist', async function () {
      const inexistentVfId = '0x00000000000000000000000000000000000000000000000000dead0000000000';
      await expect(contract.claimPayouts(inexistentVfId, [DUMMY_VF_ID])).to.be.revertedWith(`WrongVirtualFloorState(${VirtualFloorState.None})`);
    });

    it('Should revert if VF is on Running / Closed state', async function () {
      await expect(contract.connect(user1Signer).claimPayouts(vfId, [DUMMY_VF_ID])).to.be.revertedWith(`WrongVirtualFloorState(${VirtualFloorState.Active_Open_ResolvableLater})`);
    });

    it('Should claim 0 payout if the passed outcome index is not the winning outcome', async function () {
      const checkpoint = await EvmCheckpoint.create();
      await evm.setNextBlockTimestamp(tResolve);

      const betaAt = (datetime: string) => {
        const betaClose = BigNumber.from(10).pow(18);
        const dB = betaOpen_e18.sub(betaClose);
        const dT = BigNumber.from(tClose).sub(tOpen);
        const dt = BigNumber.from(tClose).sub(toTimestamp(datetime));
        const db = dB.mul(dt).div(dT);
        const beta_e18 = betaClose.add(db);
        return beta_e18.div(10n ** 12n).mul(10n ** 12n);
      };

      await helper.setResultThenLaterConfirmUnchallengedResult(ownerSigner, vfId, 1);
      const tokenId = tokenIdOf({ vfId, outcomeIndex: 0, beta: betaAt('2032-01-01T02:00:00').div(10n ** 12n) });

      const balanceBeforeClaim = await token.balanceOf(user1Signer.address);
      await expect(contract.connect(user1Signer).claimPayouts(vfId, [tokenId])).to.emit(token, 'Transfer');
      const balanceAfterClaim = await token.balanceOf(user1Signer.address);
      expect(balanceAfterClaim).to.eq(balanceBeforeClaim);

      await checkpoint.revertTo();
    });

    it('Should be able to claim original committed amount if the VF got cancelled and also transfer the amount to the user and burn the minted tokens', async function () {
      const checkpoint = await EvmCheckpoint.create();
      const vfAggregateCommitments = await contract.getVirtualFloorOutcomeTotals(
        vfId,
        2
      );
      expect(vfAggregateCommitments.amount).to.be.eq(0);

      await evm.setNextBlockTimestamp(tResolve);
      await helper.setResultThenLaterConfirmUnchallengedResult(ownerSigner, vfId, 2);

      const balanceBeforeClaim = await token.balanceOf(user2Signer.address);

      await (await contract.connect(user2Signer).claimRefunds(vfId, user2CommitmentEventArgs.tokenIds)).wait();

      const balanceAfterClaim = await token.balanceOf(user2Signer.address);
      expect(balanceAfterClaim).to.be.gt(0);
      expect(balanceAfterClaim.sub(balanceBeforeClaim)).to.be.eq(user2CommitmentEventArgs.amounts[0]);
      await checkpoint.revertTo();
    });

    it('Original owner of a commitment should not be able to claim a commitment that was transferred to 2nd owner', async () => {
      const checkpoint = await EvmCheckpoint.create();
      const vfAggregateCommitments = await contract.getVirtualFloorOutcomeTotals(vfId, 2);
      expect(vfAggregateCommitments.amount).to.be.eq(0);

      await contract
        .connect(user2Signer)
        .safeTransferFrom(
          user2Signer.address,
          user4Signer.address,
          user2CommitmentEventArgs.tokenIds[0],
          user2CommitmentEventArgs.amounts[0],
          '0x'
        );

      await evm.setNextBlockTimestamp(tResolve);
      await helper.setResultThenLaterConfirmUnchallengedResult(ownerSigner, vfId, 2);

      const paymentTokenBalanceBefore = await token.balanceOf(user2Signer.address);
      expect(contract.connect(user2Signer).claimPayouts(vfId, user2CommitmentEventArgs.tokenIds));
      const paymentTokenBalanceAfter = await token.balanceOf(user2Signer.address);
      expect(paymentTokenBalanceAfter).to.eq(paymentTokenBalanceBefore);

      await checkpoint.revertTo();
    });

    it('Should be able to claim a transferred cancelled commitment same amount as the committed amount', async function () {
      const checkpoint = await EvmCheckpoint.create();
      const vfAggregateCommitments = await contract.getVirtualFloorOutcomeTotals(
        vfId,
        2
      );
      expect(vfAggregateCommitments.amount).to.be.eq(0);

      const balanceBeforeClaim = await token.balanceOf(user4Signer.address);

      await contract
        .connect(user2Signer)
        .safeTransferFrom(
          user2Signer.address,
          user4Signer.address,
          user2CommitmentEventArgs.tokenIds[0],
          user2CommitmentEventArgs.amounts[0],
          '0x'
        );

      await evm.setNextBlockTimestamp(tResolve);
      await helper.setResultThenLaterConfirmUnchallengedResult(ownerSigner, vfId, 2);

      await (await contract.connect(user4Signer).claimRefunds(vfId, user2CommitmentEventArgs.tokenIds)).wait();

      const balanceAfterClaim = await token.balanceOf(user4Signer.address);
      expect(balanceAfterClaim).to.be.gt(0);
      expect(balanceAfterClaim.sub(balanceBeforeClaim)).to.be.eq(
        user2CommitmentEventArgs.amounts[0]
      );
      await checkpoint.revertTo();
    });
  });
});
