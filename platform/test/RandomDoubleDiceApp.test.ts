import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import assert from 'assert';
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  DoubleDiceDeploymentHelper,
  EvmHelper,
  findContractEventArgs,
  toFp18,
  toTimestamp
} from '../helpers';
import {
  RandomDoubleDiceApp,
  DoubleDiceProtocol,
  DummyUSDCoin,
  VRFCoordinatorV2Mock
} from '../lib/contracts';
import { setupSnapshotHooks, waitForAllTxs } from './helpers';

chai.use(chaiSubset);

// Emulate what goes on in the contracts
const emulateRng = (requestId: BigNumber): number => {
  // node_modules/@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol
  // words[i] = uint256(keccak256(abi.encode(_requestId, i)));
  const word0 = BigNumber.from(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], [requestId, 0])));

  return word0.mod(6).toNumber();
};

const callbackGasLimit = 300_000;

describe('Chainlink App', () => {

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
  let appContract: RandomDoubleDiceApp;
  let vrfCoordinatorMock: VRFCoordinatorV2Mock;
  let paymentToken: DummyUSDCoin;

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

    console.log(`vrfCoordinatorMock.address = ${vrfCoordinatorMock.address}`);

    appContract = await helper.deployUpgradeableRandomDoubleDiceApp({
      constructorArgs: [protocol.address, {
        vrfCoordinator: vrfCoordinatorMock.address,
        keyHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        subId: 1,
        minRequestConfirmations: 3,
        callbackGasLimit,
        linkToken: ethers.constants.AddressZero
      }],
      initializerArgs: []
    });

    await helper.setup({ protocol, randomApp: appContract });

    await (await protocol.updatePaymentTokenWhitelist(paymentToken.address, true)).wait();
  });

  setupSnapshotHooks();


  it('works', async () => {

    const vfId = BigNumber.from(0x01_0000000000012345_00_00000000n);
    const tResolve = toTimestamp('2042-01-01T02:00:00Z');

    await (await appContract.createVirtualFloor(vfId, tResolve, paymentToken.address)).wait();

    const users = [user0, user1, user2, user3, user4, user5];

    await waitForAllTxs(users.map(user => paymentToken.connect(deployer).mint(user.address, 100_000000n)));
    await waitForAllTxs(users.map(user => paymentToken.connect(user).approve(protocol.address, 100_000000n)));
    const receipts = await waitForAllTxs(users.map((user, i) => appContract.connect(user).commitToVirtualFloor(vfId, [i], [100_000000n])));

    const userTokenIds = receipts.map(({ logs }) => findContractEventArgs<{ tokenIds: BigNumber[] }>(protocol, logs, 'UserCommitment').tokenIds[0]);

    await evm.setNextBlockTimestamp(tResolve);

    {
      const { events } = await (await vrfCoordinatorMock.connect(chainlinkSubscriptionOwner).createSubscription()).wait();
      assert(Array.isArray(events));
      expect(events).to.have.lengthOf(1);
      expect(events[0].event).to.eq('SubscriptionCreated');
      expect(events[0]?.args?.subId).to.eq(1);
    }

    const { logs: resolveLogs } = await (await appContract.connect(autotask).resolve(vfId)).wait();
    const { requestId, sender: consumer } = findContractEventArgs(vrfCoordinatorMock, resolveLogs, 'RandomWordsRequested');


    const expectedOutcomeIndex = 5;

    // Emulate the contract RNG process
    expect(emulateRng(requestId)).to.eq(expectedOutcomeIndex);

    const balancesBefore = await Promise.all(users.map(user => paymentToken.balanceOf(user.address)));
    expect(balancesBefore.every(value => value.eq(0))).to.be.true;

    await (await vrfCoordinatorMock.connect(chainlinkFulfiller).fulfillRandomWords(requestId, consumer, { gasLimit: 10 * callbackGasLimit })).wait();

    await waitForAllTxs(users.map((user, i) => protocol.connect(user).claimPayouts(vfId, [userTokenIds[i]])));

    const balancesAfter = await Promise.all(users.map(user => paymentToken.balanceOf(user.address)));
    expect(balancesAfter[0]).to.eq(0);
    expect(balancesAfter[1]).to.eq(0);
    expect(balancesAfter[2]).to.eq(0);
    expect(balancesAfter[3]).to.eq(0);
    expect(balancesAfter[4]).to.eq(0);
    expect(balancesAfter[5]).to.eq(570_000000n); // 95% of 600$, since totalFeeRate is fixed at 5% for this game
  });
});
