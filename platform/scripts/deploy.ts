import assert from 'assert';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { $, DoubleDiceDeploymentHelper, toFp18 } from '../helpers';
import {
  DummyLinkToken,
  DummyLinkToken__factory,
  DummyUSDCoin,
  DummyUSDCoin__factory,
  DummyWrappedBTC,
  DummyWrappedBTC__factory
} from '../lib/contracts';
import { isTrueOrYesOr1, waitForAllTxs } from '../test/helpers';

const {
  CHAIN_ID,
  OWNER_ADDRESS,
  INIT_TOKEN_METADATA_URI_TEMPLATE,
  INIT_CONTRACT_URI,
  INIT_PROTOCOL_FEE_RATE,
  INIT_PROTOCOL_FEE_BENEFICIARY,
  ROULETTE_APP_GASLESS_TRUSTED_FORWARDER,
  DEPLOYED_USDC_ADDRESS = '',
  DEPLOYED_WBTC_ADDRESS = '',
  SKIP_DEPLOY_GRAPH_HELPER = '',
  CHAINLINK_VRF_COORDINATOR = '',
  CHAINLINK_KEY_HASH = '',
  CHAINLINK_SUBSCRIPTION_ID = '',
  CHAINLINK_MIN_REQUEST_CONFIRMATIONS = '',
  CHAINLINK_CALLBACK_GAS_LIMIT = '',
  CHAINLINK_TOKEN_ADDRESS = '',

} = process.env;

async function main() {
  // RANDOM_APP_GASLESS_TRUSTED_FORWARDER 
  assert(CHAIN_ID, 'Error: CHAIN_ID');
  assert(OWNER_ADDRESS, 'Error: OWNER_ADDRESS');
  assert(INIT_TOKEN_METADATA_URI_TEMPLATE, 'Error: INIT_TOKEN_METADATA_URI_TEMPLATE');
  assert(INIT_PROTOCOL_FEE_RATE, 'Error: INIT_PROTOCOL_FEE_RATE');
  assert(INIT_PROTOCOL_FEE_BENEFICIARY, 'Error: INIT_PROTOCOL_FEE_BENEFICIARY');
  assert(ROULETTE_APP_GASLESS_TRUSTED_FORWARDER, 'Error: RANDOM_APP_GASLESS_TRUSTED_FORWARDER');
  assert(INIT_CONTRACT_URI, 'Error: INIT_CONTRACT_URI');
  assert(CHAINLINK_KEY_HASH, 'Error: CHAINLINK_KEY_HASH');
  assert(CHAINLINK_SUBSCRIPTION_ID, 'Error: CHAINLINK_SUBSCRIPTION_ID');
  assert(CHAINLINK_MIN_REQUEST_CONFIRMATIONS, 'Error: CHAINLINK_MIN_REQUEST_CONFIRMATIONS');
  assert(CHAINLINK_CALLBACK_GAS_LIMIT, 'Error: CHAINLINK_CALLBACK_GAS_LIMIT');

  const { chainId } = await ethers.provider.getNetwork();
  assert(parseInt(CHAIN_ID) === chainId, `${CHAIN_ID} !== ${chainId}; wrong .env config?`);

  const deployer = await ethers.getSigner(OWNER_ADDRESS);

  const helper = new DoubleDiceDeploymentHelper(deployer);

  let tokenUSDC: DummyUSDCoin;
  if (DEPLOYED_USDC_ADDRESS) {
    tokenUSDC = DummyUSDCoin__factory.connect(DEPLOYED_USDC_ADDRESS, deployer);
  } else {
    tokenUSDC = await helper.deployDummyUSDCoin();
  }

  let tokenWBTC: DummyWrappedBTC;
  if (DEPLOYED_WBTC_ADDRESS) {
    tokenWBTC = DummyWrappedBTC__factory.connect(DEPLOYED_WBTC_ADDRESS, deployer);
  } else {
    tokenWBTC = await helper.deployDummyWrappedBTC();
  }

  await helper.deployProxyAdmin();

  const protocol = await helper.deployUpgradeableDoubleDiceProtocol({
    constructorArgs: [],
    initializerArgs: [{
      tokenMetadataUriTemplate: INIT_TOKEN_METADATA_URI_TEMPLATE,
      protocolFeeRate_e18: toFp18(INIT_PROTOCOL_FEE_RATE),
      protocolFeeBeneficiary: INIT_PROTOCOL_FEE_BENEFICIARY,
      contractURI: INIT_CONTRACT_URI,
    }]
  });

  let vrfCoordinatorAddress: string, linkTokenAddress: string;
  if (chainId === 1337) {
    // Do not deploy from account 0, so as to not disrupt following subsequent deployment addresses
    const [, vrfCoordinatorV2MockDeployer] = await ethers.getSigners();
    const vrfCoordinator = await new DoubleDiceDeploymentHelper(vrfCoordinatorV2MockDeployer).deployVRFCoordinatorV2Mock();
    vrfCoordinatorAddress = vrfCoordinator.address;
    const linkToken = await helper.deployDummyLinkToken();
    linkTokenAddress = linkToken.address;


    const [, user0, user1, user2, user3, user4, user5, chainlinkSubscriptionOwner] = await ethers.getSigners();
    const users = [deployer, user0, user1, user2, user3, user4, user5];
    const MAX_PAYMENT_TOKEN_PER_USER = $(500);

    await (await vrfCoordinator.connect(chainlinkSubscriptionOwner).createSubscription()).wait();

    await waitForAllTxs(users.map(user => tokenUSDC.connect(deployer).mint(user.address, MAX_PAYMENT_TOKEN_PER_USER)));
    await waitForAllTxs(users.map(user => tokenUSDC.connect(user).approve(protocol.address, MAX_PAYMENT_TOKEN_PER_USER)));
  } else {
    assert(CHAINLINK_VRF_COORDINATOR, 'Error: CHAINLINK_VRF_COORDINATOR');
    vrfCoordinatorAddress = CHAINLINK_VRF_COORDINATOR;
    linkTokenAddress = CHAINLINK_TOKEN_ADDRESS;
  }


  const classicApp = await helper.deployUpgradeableClassicDoubleDiceApp({
    constructorArgs: [protocol.address, tokenUSDC.address],
    initializerArgs: []
  });

  const randomApp = await helper.deployUpgradeableRandomDoubleDiceApp({
    constructorArgs: [protocol.address, {
      vrfCoordinator: vrfCoordinatorAddress,
      keyHash: CHAINLINK_KEY_HASH,
      subId: BigNumber.from(CHAINLINK_SUBSCRIPTION_ID),
      minRequestConfirmations: BigNumber.from(CHAINLINK_MIN_REQUEST_CONFIRMATIONS),
      callbackGasLimit: Number(CHAINLINK_CALLBACK_GAS_LIMIT),
      linkToken: linkTokenAddress,
    }],
    initializerArgs: []
  });

  const rouletteApp = await helper.deployUpgradeableRouletteDoubleDiceApp({
    constructorArgs: [protocol.address, {
      vrfCoordinator: vrfCoordinatorAddress,
      keyHash: CHAINLINK_KEY_HASH,
      subId: BigNumber.from(CHAINLINK_SUBSCRIPTION_ID),
      minRequestConfirmations: BigNumber.from(CHAINLINK_MIN_REQUEST_CONFIRMATIONS),
      callbackGasLimit: Number(CHAINLINK_CALLBACK_GAS_LIMIT),
      linkToken: linkTokenAddress,
    },ROULETTE_APP_GASLESS_TRUSTED_FORWARDER],
    initializerArgs: []
  });

  await helper.setup({ protocol, classicApp, randomApp, rouletteApp });

  console.log(`Whitelisting USDC@${tokenUSDC.address} on DoubleDice contract`);
  await ((await protocol.updatePaymentTokenWhitelist(tokenUSDC.address, true)).wait());

  console.log(`Whitelisting WBTC@${tokenWBTC.address} on DoubleDice contract`);
  await ((await protocol.updatePaymentTokenWhitelist(tokenWBTC.address, true)).wait());

  if (!isTrueOrYesOr1(SKIP_DEPLOY_GRAPH_HELPER)) {
    await helper.deployUpgradeableGraphHelper();
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });