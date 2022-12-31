import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'hardhat';
import { $, generateRandomVirtualFloorId } from '../helpers';
import { DummyUSDCoin__factory,  encodeRouletteVirtualFloorMetadata,  RouletteDoubleDiceApp__factory } from '../lib/contracts';

const TOKEN_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const ROULETTE_CONTRACT_ADDRESS = '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c';

async function main() {
  const [owner] = await ethers.getSigners();

  const roulette = new RouletteDoubleDiceApp__factory(owner).attach(ROULETTE_CONTRACT_ADDRESS);

  const token = new DummyUSDCoin__factory(owner).attach(TOKEN_CONTRACT_ADDRESS);

  const unroundedTimestamp = Math.floor(Date.now() / 1000);
  const timestamp = unroundedTimestamp - unroundedTimestamp % 60;

  const vfIds = [];

  for (let i = 0; i < 2; i++) {
    const vfId = generateRandomVirtualFloorId();

    vfIds.push(vfId);
  }

  const tOpen = timestamp + 0 * 86400;
  const tResolve = timestamp + 2 * 86400;  

  const metadata = encodeRouletteVirtualFloorMetadata([['Custom Table', 'Custom Environment']]);

  const receipt = await (await roulette.createRouletteSession({
    vfIds,
    paymentToken: token.address,
    totalFeeRate_e18: 50000_000000_000000n, // = 0.05 = 5.00%
    bonusAmounts: [0,0],
    tOpen,
    tResolve,
    nOutcomes: BigNumber.from(36),
    optionalMinCommitmentAmount: $(1),
    optionalMaxCommitmentAmount: $(100),
    metadata
  })).wait();
  

  console.log('receipts', receipt);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });