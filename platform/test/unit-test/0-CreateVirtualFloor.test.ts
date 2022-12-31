import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  DoubleDiceDeploymentHelper,
  DUMMY_METADATA,
  ENCODED_DUMMY_METADATA,
  EvmCheckpoint,
  EvmHelper,
  findContractEventArgs,
  SignerWithAddress,
  toFp18,
  toTimestamp
} from '../../helpers';
import {
  ClassicDoubleDiceApp,
  DoubleDiceProtocol,
  DummyUSDCoin,
  DummyWrappedBTC,
  encodeVirtualFloorMetadata,
  VirtualFloorCreationParamsStruct
} from '../../lib/contracts';

chai.use(chaiSubset);

const totalFeeRate_e18 = 50000_000000_000000n; // 0.05 = 5%

const MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE = 10 * 60;

describe('ClassicDoubleDiceApp/Create', function () {
  let ownerSigner: SignerWithAddress;
  let secondCreator: SignerWithAddress;
  let protocolFeeBeneficiarySigner: SignerWithAddress;
  let contract: DoubleDiceProtocol;
  let appContract: ClassicDoubleDiceApp;
  let token: DummyUSDCoin | DummyWrappedBTC;
  let evm: EvmHelper;
  let checkpoint: EvmCheckpoint;
  const vfId = '0x0000000000000000000000000000000000000100000000000123450000000000';
  const tOpen = toTimestamp('2032-01-01T00:00:00');
  const tClose = toTimestamp('2032-01-01T12:00:00');
  const tResolve = toTimestamp('2032-01-02T00:00:00');
  const nOutcomes = 3;
  const betaOpen_e18 = BigNumber.from(10)
    .pow(18)
    .mul(13); // 1 unit per hour
  let vfParams: VirtualFloorCreationParamsStruct;

  before(async () => {
    evm = new EvmHelper(ethers.provider);

    [
      ownerSigner,
      protocolFeeBeneficiarySigner,
      secondCreator
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
    }

    vfParams = {
      vfId,
      betaOpen_e18,
      totalFeeRate_e18,
      tOpen,
      tClose,
      tResolve,
      nOutcomes,
      paymentToken: token.address,
      bonusAmount: 0,
      optionalMinCommitmentAmount: 0,
      optionalMaxCommitmentAmount: 0,
      metadata: ENCODED_DUMMY_METADATA,
      creator: ownerSigner.address,
    };

    checkpoint = await EvmCheckpoint.create();
  });

  describe('tOpen < tClose <= tResolve', () => {
    beforeEach(async () => {
      await evm.setNextBlockTimestamp(tOpen);
    });
    describe('tOpen < tClose', () => {
      it('tClose < tOpen reverts', async () => {
        await expect(appContract.createVirtualFloor({ ...vfParams, tClose: tOpen - 1 })).to.be.revertedWith('InvalidTimeline()');
      });
      it('tClose == tOpen reverts', async () => {
        await expect(appContract.createVirtualFloor({ ...vfParams, tClose: tOpen })).to.be.revertedWith('InvalidTimeline()');
      });
      it('tClose > tOpen succeeds', async () => {
        await expect(appContract.createVirtualFloor({ ...vfParams, tClose: tOpen + 1 })).to.emit(contract, 'VirtualFloorCreation');
      });
    });
    describe('tClose <= tResolve', () => {
      it('tResolve < tClose reverts', async () => {
        await expect(appContract.createVirtualFloor({ ...vfParams, tResolve: tClose - 1 })).to.be.revertedWith('InvalidTimeline()');
      });
      it('tResolve < tClose + MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE reverts', async () => {
        await expect(appContract.createVirtualFloor({ ...vfParams, tResolve: tClose + MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE - 1 })).to.be.revertedWith('InvalidTimeline()');
      });
      it('tResolve == tClose + MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE succeeds', async () => {
        await expect(appContract.createVirtualFloor({ ...vfParams, tResolve: tClose + MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE })).to.emit(contract, 'VirtualFloorCreation');
      });
      it('tResolve > tClose + MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE succeeds', async () => {
        await expect(appContract.createVirtualFloor({ ...vfParams, tResolve: tClose + MIN_POSSIBLE_T_RESOLVE_MINUS_T_CLOSE + 1 })).to.emit(contract, 'VirtualFloorCreation');
      });
    });
  });

  it('nOutcomes > 2', async () => {
    await expect(appContract.createVirtualFloor({ ...vfParams, nOutcomes: 1 })).to.be.revertedWith('NotEnoughOutcomes()');
    await expect(appContract.createVirtualFloor({
      ...vfParams,
      nOutcomes: 2,
      metadata: encodeVirtualFloorMetadata({
        ...DUMMY_METADATA,
        outcomes: DUMMY_METADATA.outcomes.slice(0, 2)
      })
    })).to.emit(contract, 'VirtualFloorCreation');
  });

  it('betaOpen >= 1.0', async () => {
    await expect(appContract.createVirtualFloor({ ...vfParams, betaOpen_e18: 999999_999999_999999n })).to.be.revertedWith('BetaOpenTooSmall()');
    await expect(appContract.createVirtualFloor({ ...vfParams, betaOpen_e18: 1_000000_000000_000000n })).to.emit(contract, 'VirtualFloorCreation');
  });

  it('totalFeeRate <= 1.0', async () => {
    await expect(appContract.createVirtualFloor({ ...vfParams, totalFeeRate_e18: 1_000000_000000_000001n })).to.be.revertedWith('CreationFeeRateTooLarge()');
    await expect(appContract.createVirtualFloor({ ...vfParams, totalFeeRate_e18: 1_000000_000000_000000n })).to.emit(contract, 'VirtualFloorCreation');
  });

  it('Creation must happen up to 10% into the Running period', async () => {

    const params = {
      ...vfParams,
      tOpen: toTimestamp('2032-01-30T00:00:00'),
      tClose: toTimestamp('2032-01-30T10:00:00'), // 10 hours later
      tResolve: toTimestamp('2032-01-30T12:00:00')
    };

    const localCheckpoint = await EvmCheckpoint.create();

    const tCreateMax = toTimestamp('2032-01-30T01:00:00');

    evm.setNextBlockTimestamp(tCreateMax + 1);
    await expect(appContract.createVirtualFloor(params)).to.be.revertedWith('TooLate()');
    await localCheckpoint.revertTo();

    evm.setNextBlockTimestamp(tCreateMax);
    const { logs } = await (await appContract.createVirtualFloor(params)).wait();
    const { vfId } = findContractEventArgs(contract, logs, 'VirtualFloorCreation');
    expect(vfId).to.eq(params.vfId);
    await localCheckpoint.revertTo();
  });

  it('Should assign creator correctly', async () => {
    await (await appContract.connect(ownerSigner).adjustCreationQuotas([{ creator: secondCreator.address, relativeAmount: 1 }])).wait();
    await (await appContract.connect(secondCreator).createVirtualFloor({ ...vfParams, creator: secondCreator.address })).wait();
    expect(await contract.getVirtualFloorCreator(vfId)).to.eq(secondCreator.address);
  });

  it('Should create VF if right arguments passed', async () => {
    const { logs } = await (await appContract.createVirtualFloor(vfParams)).wait();
    const virtualFloorCreationEventArgs = findContractEventArgs(contract, logs, 'VirtualFloorCreation');
    expect(virtualFloorCreationEventArgs.vfId).to.eq(vfId);
  });

  it('Should revert if VF with same id created before', async () => {
    await (await appContract.createVirtualFloor(vfParams)).wait();
    await expect(appContract.createVirtualFloor(vfParams)).to.be.revertedWith('DuplicateVirtualFloorId()');
  });

  afterEach(async () => {
    await checkpoint.revertTo();
  });
});
