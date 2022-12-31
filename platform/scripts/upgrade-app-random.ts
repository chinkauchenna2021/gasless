import assert from 'assert';
import { ethers } from 'hardhat';
import { DoubleDiceDeploymentHelper } from '../helpers';

const {
  CHAIN_ID,
  OWNER_ADDRESS,
  DOUBLEDICE_PROTOCOL_CONTRACT_ADDRESS,
  RANDOM_APP_CONTRACT_ADDRESS,
  DOUBLEDICE_PROXY_ADMIN_ADDRESS,
  CHAINLINK_VRF_COORDINATOR,
  CHAINLINK_KEY_HASH,
  CHAINLINK_SUBSCRIPTION_ID,
  CHAINLINK_MIN_REQUEST_CONFIRMATIONS,
  CHAINLINK_CALLBACK_GAS_LIMIT,

} = process.env;

async function main() {

  assert(CHAIN_ID);
  assert(OWNER_ADDRESS);
  assert(DOUBLEDICE_PROTOCOL_CONTRACT_ADDRESS);
  assert(RANDOM_APP_CONTRACT_ADDRESS);
  assert(DOUBLEDICE_PROXY_ADMIN_ADDRESS);

  assert(CHAINLINK_VRF_COORDINATOR);
  assert(CHAINLINK_KEY_HASH);
  assert(CHAINLINK_SUBSCRIPTION_ID);
  assert(CHAINLINK_MIN_REQUEST_CONFIRMATIONS);
  assert(CHAINLINK_CALLBACK_GAS_LIMIT);

  const { chainId } = await ethers.provider.getNetwork();
  assert(parseInt(CHAIN_ID) === chainId, `${CHAIN_ID} !== ${chainId}; wrong .env config?`);

  const deployer = await ethers.getSigner(OWNER_ADDRESS);

  const helper = new DoubleDiceDeploymentHelper(deployer, DOUBLEDICE_PROXY_ADMIN_ADDRESS);
  const linkToken = await helper.deployDummyLinkToken();
  const  linkTokenAddress = linkToken.address;

  await helper.upgradeRandomDoubleDiceApp(RANDOM_APP_CONTRACT_ADDRESS, [DOUBLEDICE_PROTOCOL_CONTRACT_ADDRESS, {
    vrfCoordinator: CHAINLINK_VRF_COORDINATOR,
    keyHash: CHAINLINK_KEY_HASH,
    subId: CHAINLINK_SUBSCRIPTION_ID,
    minRequestConfirmations: CHAINLINK_MIN_REQUEST_CONFIRMATIONS,
    callbackGasLimit: CHAINLINK_CALLBACK_GAS_LIMIT,
    linkToken:linkTokenAddress
  }]);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
