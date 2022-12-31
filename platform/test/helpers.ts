import assert from 'assert';
import { ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';

// https://stackoverflow.com/questions/62282408/how-to-extend-mochas-context-interface
declare module 'mocha' {
  export interface Context {
    evmSnapshot: string;
  }
}

export const setupSnapshotHooks = () => {

  beforeEach(async function () {
    this.evmSnapshot = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async function () {
    assert(await ethers.provider.send('evm_revert', [this.evmSnapshot]));
  });

};

// ToDo: Drop this function when hardhat-waffle typed revertWith starts to exist
export const getError = async (promise: Promise<unknown>): Promise<any> => {
  try {
    await promise;
  } catch (e: any) {
    return e;
  }
  throw new Error('Was expecting error to be thrown');
};

export const waitForAllTxs = async (promisedTxs: Promise<ContractTransaction>[]) => {
  const txs = await Promise.all(promisedTxs);
  return await Promise.all(txs.map(tx => tx.wait()));
};

export const isTrueOrYesOr1 = (value: string): boolean => /^(true|yes|1)$/i.test(value);
