import { Log } from '@ethersproject/providers';
import assert from 'assert';
import { BigNumber as BigDecimal } from 'bignumber.js';
import { BaseContract, BigNumber, BigNumberish, ContractReceipt, ethers } from 'ethers';
import { Interface, Result } from 'ethers/lib/utils';
import {
  encodeVirtualFloorMetadata,
  RoomEventInfo,
  VirtualFloorMetadataV1Struct
} from '../lib/contracts';

const MULTIPLIER = new BigDecimal(10).pow(18);

export const toFp18 = (value: number | string): BigNumber => {
  return BigNumber.from(new BigDecimal(value).dp(18, BigDecimal.ROUND_FLOOR).multipliedBy(MULTIPLIER).toString());
};

export const sumOf = (...values: BigNumber[]): BigNumber =>
  values.reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from(0));

export const formatUsdc = (wei: BigNumberish): string =>
  `${(BigNumber.from(wei).toNumber() / 1e6).toFixed(6).replace(/\.(\d{2})(\d{4})/, '.$1,$2')} USDC`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findContractEventArgs = <T = any>(contract: BaseContract, logs: ContractReceipt['logs'], name: string): T => {
  const events = decodeEventLogs(contract, logs);
  assert(events !== undefined, `Could not decode any logs from ${contract.address}`);
  const event = events.find(({ event }) => event === name);
  assert(event, `Could not decode a ${name} event from logs`);
  assert(event.args);
  return event.args as unknown as T;
};

export interface UserCommitment {
  vfId: BigNumber;
  committer: string;
  outcomeIndexes: BigNumber[];
  amounts: BigNumber[];
  beta_e18: BigNumber;
  tokenIds: BigNumber[];
}

enum VirtualFloorResolutionType {
  'NoWinners',
  'AllWinners',
  'SomeWinners'
}

export interface VirtualFloorResolutions {
  vfId: BigNumber;
  winningOutcomeIndexFlags: BigNumber;
  resolutionType: VirtualFloorResolutionType;
  winnerProfits: BigNumber;
  protocolFeeAmount: BigNumber;
  creatorFeeAmount: BigNumber;
}

export const findUserCommitmentEventArgs = (contract: BaseContract, logs: ContractReceipt['logs']): UserCommitment => {
  return findContractEventArgs(contract, logs, 'UserCommitment');
};

export const findVfResolutionsEventArgs = (contract: BaseContract, logs: ContractReceipt['logs']): VirtualFloorResolutions => {
  return findContractEventArgs(contract, logs, 'VirtualFloorResolutions');
};

export const DUMMY_METADATA: RoomEventInfo = {
  category: 'sports',
  subcategory: 'football',
  title: 'Finland vs. Argentina',
  description: 'Finland vs. Argentina FIFA 2022 world cup final',
  isListed: false,
  opponents: [
    { title: 'Finland', image: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Huuhkajat_logo.svg' },
    { title: 'Argentina', image: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Argentina_national_football_team_logo.svg' }
  ],
  outcomes: [
    { title: 'Finland win' },
    { title: 'Argentina win' },
    { title: 'Tie' }
  ],
  resultSources: [
    { title: 'Official FIFA result page', url: 'http://fifa.com/argentina-vs-finland' }
  ],
  discordChannelId: '123456789',
  extraData: '0x',
};

export const generateRandomVirtualFloorId = () =>
  ethers.utils.hexConcat([
    '0x01',
    ethers.utils.hexlify(ethers.utils.randomBytes(8)),
    '0x00',
    '0x00000000',
  ]);

export const ENCODED_DUMMY_METADATA = encodeVirtualFloorMetadata(DUMMY_METADATA);

export const timestampMinuteCeil = (timestamp: number) => Math.ceil(timestamp / 60) * 60;

export const toTimestamp = (datetime: string): number => BigNumber.from(new Date(datetime).getTime() / 1000).toNumber();

export function tokenIdOf({ vfId, outcomeIndex, beta }: { vfId: BigNumberish; outcomeIndex: number; beta: BigNumberish }): BigNumber {
  return BigNumber.from(ethers.utils.solidityPack(
    ['uint216', 'uint8', 'uint32'],
    [BigNumber.from(vfId).shr((1 + 4) * 8), outcomeIndex, beta]
  ));
}

export const $ = (dollars: BigNumberish, millionths: BigNumberish = 0): BigNumber =>
  BigNumber.from(1000000)
    .mul(dollars)
    .add(millionths);

export const UNSPECIFIED_COMMITMENT_DEADLINE = 0;

const range = (n: number): number[] => new Array(n).fill(undefined).map((_, i) => i);

type DummyMetadataParams = {
  nOutcomes: number;
  nOpponents?: number;
  nResultSources?: number;
}

export const genDummyMetadata = ({ nOutcomes, nOpponents = 2, nResultSources = 2 }: DummyMetadataParams): VirtualFloorMetadataV1Struct => ({
  category: 'category',
  subcategory: 'subcategory',
  title: 'Title',
  description: 'Description',
  isListed: false,
  opponents: range(nOpponents).map(i => ({ title: `Opponent ${i}`, image: `https://example.com/opponents/${i}/image.jpg` })),
  outcomes: range(nOutcomes).map(i => ({ title: `Outcome ${i}` })),
  resultSources: range(nResultSources).map(i => ({ title: `Result source ${i}`, url: `https://example.com/result-sources/${i}` })),
  discordChannelId: 'discordChannelId',
  extraData: '0x',
});

export function decodeEventLog(iface: Interface, log: Log): { event: string, args: Result } | undefined {
  for (const eventFragment of Object.values(iface.events)) {
    try {
      return {
        event: eventFragment.name,
        args: iface.decodeEventLog(eventFragment, log.data, log.topics)
      };
    } catch (e) {
      continue;
    }
  }
  return undefined;
}

export function decodeEventLogs(contract: BaseContract, logs: Log[]): { event: string, args: Result }[] {
  return logs
    .filter(({ address }) => address === contract.address)
    .map(log => {
      const decoded = decodeEventLog(contract.interface, log);
      assert(decoded);
      return decoded;
    });
}

export const delaySeconds = (seconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const getRouletteRoundDiffInMilliseconds = (tResolve: BigNumberish, tOpen: BigNumberish, nRounds: BigNumberish) => {
  const timeDiff = BigNumber.from(tResolve)
    .sub(BigNumber.from(tOpen))
    .div(BigNumber.from(nRounds));

  return timeDiff;
};
