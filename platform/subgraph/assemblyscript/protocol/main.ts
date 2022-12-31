/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */
// Note: Despite the .ts file extension, this is AssemblyScript not TypeScript!

import {
  Address,
  BigDecimal,
  BigInt,
  ethereum
} from '@graphprotocol/graph-ts';
import {
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  UserCommitment as UserCommitmentEvent,
  VirtualFloorCancellationFlagged as VirtualFloorCancellationFlaggedEvent,
  VirtualFloorCancellationUnresolvable as VirtualFloorCancellationUnresolvableEvent,
  VirtualFloorCreation as ProtocolVirtualFloorCreationEvent,
  VirtualFloorResolutions as VirtualFloorResolutionsEvent
} from '../../../generated/DoubleDiceProtocol/DoubleDiceProtocol';
import {
  Outcome as VfOutcome,
  OutcomeTimeslot as VfOutcomeTimeslot,
  OutcomeTimeslotTransfer as VfOutcomeTimeslotTransfer,
  PaymentToken,
  ProtocolVirtualFloorCreationEventEntity,
  User,
  VirtualFloorsAggregate
} from '../../../generated/schema';
import {
  VirtualFloorResolutionType
} from '../../../lib/helpers/sol-enums';
import {
  SINGLETON_AGGREGATE_ENTITY_ID
} from '../constants';
import { createNewEntity, loadExistentEntity } from '../entity-lib';
import {
  bigIntFixedPointToBigDecimal
} from '../utils';
import {
  AbstractVf,
  assertUserEntity,
  assertVfOutcomeTimeslotEntity,
  assertVfOutcomeTimeslotUserEntity,
  assertVfOutcomeUserEntity,
  assertVfUserEntity,
  genVfEntityId,
  genVfOutcomeTimeslotEntityId,
  loadExistentVfEntity,
  loadExistentVfEntityId,
  loadExistentVfOutcomeEntity
} from './entities';
import { assertPaymentTokenEntity } from './payment-tokens';
import {
  VirtualFloorState__Active_ResultNone,
  VirtualFloorState__Claimable_Payouts,
  VirtualFloorState__Claimable_Refunds_Flagged,
  VirtualFloorState__Claimable_Refunds_ResolvableNever,
  VirtualFloorState__Claimable_Refunds_ResolvedNoWinners
} from './state';


// Note: Bump up this nonce if we need to deploy the same build to multiple subgraphs,
// This will force a new build-id, thus averting potential issues on thegraph.com hosted service.
export const DUMMY_DEPLOYMENT_NONCE = 12;

const MIN_POSSIBLE_COMMITMENT_AMOUNT = BigInt.fromString('1');
const MAX_POSSIBLE_COMMITMENT_AMOUNT = BigInt.fromString('115792089237316195423570985008687907853269984665640564039457584007913129639935');


export function handleProtocolVirtualFloorCreation(event: ProtocolVirtualFloorCreationEvent): void {
  const vfId = genVfEntityId(event.params.vfId);
  const baseEventEntity = createNewEntity<ProtocolVirtualFloorCreationEventEntity>(ProtocolVirtualFloorCreationEventEntity.load, vfId);
  baseEventEntity.params_vfId = event.params.vfId;
  baseEventEntity.params_creator = event.params.creator;
  baseEventEntity.params_totalFeeRate_e18 = event.params.totalFeeRate_e18;
  baseEventEntity.params_protocolFeeRate_e18 = event.params.protocolFeeRate_e18;
  baseEventEntity.params_tOpen = event.params.tOpen;
  baseEventEntity.params_tClose = event.params.tClose;
  baseEventEntity.params_tResolve = event.params.tResolve;
  baseEventEntity.params_nOutcomes = event.params.nOutcomes;
  baseEventEntity.params_paymentToken = event.params.paymentToken;
  baseEventEntity.params_bonusAmount = event.params.bonusAmount;
  baseEventEntity.params_minCommitmentAmount = event.params.minCommitmentAmount;
  baseEventEntity.params_maxCommitmentAmount = event.params.maxCommitmentAmount;
  baseEventEntity.params_application = event.params.application;
  baseEventEntity.transaction_hash = event.transaction.hash;
  baseEventEntity.block_timestamp = event.block.timestamp;
  baseEventEntity.save();
}

// See note on AbstractVf
export function handleCommonVirtualFloorCreation(vfId: string, vf: AbstractVf): void {
  {
    let aggregate = VirtualFloorsAggregate.load(SINGLETON_AGGREGATE_ENTITY_ID);
    if (aggregate == null) {
      aggregate = new VirtualFloorsAggregate(SINGLETON_AGGREGATE_ENTITY_ID);
      aggregate.totalVirtualFloorsCreated = 0;
    }
    aggregate.totalVirtualFloorsCreated += 1;
    aggregate.save();
  }

  const baseEvent = loadExistentEntity<ProtocolVirtualFloorCreationEventEntity>(ProtocolVirtualFloorCreationEventEntity.load, vfId);

  vf.intId = baseEvent.params_vfId;

  const creator = assertUserEntity(Address.fromBytes(baseEvent.params_creator));
  vf.creator = creator.id;
  adjustUserConcurrentVirtualFloors(creator, +1);

  vf.application = baseEvent.params_application;

  // Since the platform contract will reject VirtualFloors created with a PaymentToken that is not whitelisted,
  // we are sure that the PaymentToken entity referenced here will have always been created beforehand
  // when the token was originally whitelisted.
  const paymentToken = assertPaymentTokenEntity(Address.fromBytes(baseEvent.params_paymentToken));
  assert(paymentToken.isWhitelisted);
  vf.paymentToken = paymentToken.id;

  vf.totalFeeRate = bigIntFixedPointToBigDecimal(baseEvent.params_totalFeeRate_e18, 18);
  vf.protocolFeeRate = bigIntFixedPointToBigDecimal(baseEvent.params_protocolFeeRate_e18, 18);

  vf.creationTxHash = baseEvent.transaction_hash;
  vf.creationTxTimestamp = baseEvent.block_timestamp;

  vf.tClose = baseEvent.params_tClose;
  vf.tResolve = baseEvent.params_tResolve;
  vf.state = VirtualFloorState__Active_ResultNone;

  const decimalBonusAmount = bigIntFixedPointToBigDecimal(baseEvent.params_bonusAmount, paymentToken.decimals);
  vf.bonusAmount = decimalBonusAmount;
  vf.totalSupply = decimalBonusAmount;

  // It turns out that BigDecimal cannot hold more than 34 significant digits, so it cannot represent MaxUint256 precisely.
  // As MaxUint256 is being used as a "special value" anyway, to signify "no maximum", we represent "no maximum" with `null` instead.
  const unsafeMinCommitmentAmount = bigIntFixedPointToBigDecimal(baseEvent.params_minCommitmentAmount, paymentToken.decimals);
  const unsafeMaxCommitmentAmount = bigIntFixedPointToBigDecimal(baseEvent.params_maxCommitmentAmount, paymentToken.decimals);
  vf.optionalMinCommitmentAmount = baseEvent.params_minCommitmentAmount.equals(MIN_POSSIBLE_COMMITMENT_AMOUNT) ? null : unsafeMinCommitmentAmount;
  vf.optionalMaxCommitmentAmount = baseEvent.params_maxCommitmentAmount.equals(MAX_POSSIBLE_COMMITMENT_AMOUNT) ? null : unsafeMaxCommitmentAmount;

  // We save it on the entity so that we can read it from other handlers,
  // as it is not possible to use vf.outcomes.length
  vf.nOutcomes = baseEvent.params_nOutcomes;
}


export function handleUserCommitment(event: UserCommitmentEvent): void {
  for (let i = 0; i < event.params.outcomeIndexes.length; i++) {
    const outcomeIndex = event.params.outcomeIndexes[i];
    const beta_e18 = event.params.beta_e18[i];
    const tokenId = event.params.tokenIds[i];

    const vfOutcome = loadExistentVfOutcomeEntity(event.params.vfId, outcomeIndex);

    const beta = bigIntFixedPointToBigDecimal(beta_e18, 18);
    assertVfOutcomeTimeslotEntity(vfOutcome, tokenId, beta);

  }

  const fromUser = Address.zero();

  // Note: We use an explicit `committer` param rather than relying on the underlying `event.transaction.from`
  // as if the transaction were being relayed by a 3rd party,
  // the commitment would be mistakenly attributed to the relayer.
  const toUser = event.params.committer;

  // Possibly this handler could simply instantiate the entities and exit at this point,
  // and then let the balances be updated in the handleTransferSingle executed
  // soon after during the same transaction.
  // But this would make the code depend on the ordering of events.
  // It might work, but it needs to be tested.
  // So instead, we update the balances right here,
  // and then during the handling of transfers, we skip mints.
  handleTransfers(event, fromUser, toUser, event.params.tokenIds, event.params.amounts);
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  // For mints, do not handle TransferSingle event itself, as this is already handled in handleUserCommitment
  if (event.params.from.equals(Address.zero())) {
    return;
  }
  handleTransfers(event, event.params.from, event.params.to, [event.params.id], [event.params.value]);
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  // For mints, do not handle TransferBatch event itself, as this is already handled in handleUserCommitment
  if (event.params.from.equals(Address.zero())) {
    return;
  }
  handleTransfers(event, event.params.from, event.params.to, event.params.ids, event.params.values);
}

function handleTransfers(event: ethereum.Event, fromAddr: Address, toAddr: Address, ids: BigInt[], values: BigInt[]): void {
  assert(ids.length == values.length);

  const isMint = fromAddr.equals(Address.zero());
  const isBurn = toAddr.equals(Address.zero());

  const fromUser = assertUserEntity(fromAddr);
  const toUser = assertUserEntity(toAddr);

  for (let i = 0; i < ids.length; i++) {
    const tokenId = ids[i];
    const value = values[i];

    const vfOutcomeTimeslot = loadExistentEntity<VfOutcomeTimeslot>(VfOutcomeTimeslot.load, genVfOutcomeTimeslotEntityId(tokenId));
    const vfOutcome = loadExistentEntity<VfOutcome>(VfOutcome.load, vfOutcomeTimeslot.outcome);
    const vf = loadExistentVfEntityId(vfOutcome.virtualFloor);
    const amount = bigIntFixedPointToBigDecimal(value, loadExistentEntity<PaymentToken>(PaymentToken.load, vf.paymentToken).decimals);

    // We debit (credit -amount) the "from" hierarchy, and credit the "to" hierarchy.

    if (isMint) {
      // Do not debit the 0-address
    } else {
      const claimAmount = isBurn ? amount : BigDecimal.zero();
      creditEntityHierarchy(vfOutcomeTimeslot, fromUser, amount.neg(), claimAmount);
    }

    // Credit `to` even if it is address(0) and this is an ERC-1155 balance-burn,
    // as like that the totals will still remain under the VirtualFloor, Outcome, OutcomeTimeslot, etc.
    // They will be credited to address(0), so this address will eventually accumulate a lot of balance,
    // but it doesn't matter!
    // Doing it this way keeps things simple: the balance doesn't perish, it simply "changes ownership" to address(0)
    creditEntityHierarchy(vfOutcomeTimeslot, toUser, amount, BigDecimal.zero());

    const posOfEventInTx = event.transactionLogIndex;
    const outcomeTimeslotTransferEntityId = `${vfOutcomeTimeslot.id}-${event.transaction.hash.toHex()}-${posOfEventInTx}-${i}`;
    const vfOutcomeTimeslotTransfer = createNewEntity<VfOutcomeTimeslotTransfer>(VfOutcomeTimeslotTransfer.load, outcomeTimeslotTransferEntityId);
    vfOutcomeTimeslotTransfer.outcomeTimeslot = vfOutcomeTimeslot.id;
    vfOutcomeTimeslotTransfer.from = fromUser.id;
    vfOutcomeTimeslotTransfer.to = toUser.id;
    vfOutcomeTimeslotTransfer.txHash = event.transaction.hash;
    vfOutcomeTimeslotTransfer.txTimestamp = event.block.timestamp;
    vfOutcomeTimeslotTransfer.amount = amount;
    vfOutcomeTimeslotTransfer.save();
  }
}

function creditEntityHierarchy(vfOutcomeTimeslot: VfOutcomeTimeslot, user: User, amount: BigDecimal, claimAmount: BigDecimal): void {
  const amountTimesBeta = amount.times(vfOutcomeTimeslot.beta);

  vfOutcomeTimeslot.totalSupply = vfOutcomeTimeslot.totalSupply.plus(amount);
  vfOutcomeTimeslot.save();

  const vfOutcome = loadExistentEntity<VfOutcome>(VfOutcome.load, vfOutcomeTimeslot.outcome);
  vfOutcome.totalSupply = vfOutcome.totalSupply.plus(amount);
  vfOutcome.totalWeightedSupply = vfOutcome.totalWeightedSupply.plus(amountTimesBeta);
  vfOutcome.save();

  const vf = loadExistentVfEntityId(vfOutcome.virtualFloor);
  vf.totalSupply = vf.totalSupply.plus(amount);
  vf.save();

  const vfUser = assertVfUserEntity(vf, user);
  vfUser.totalBalance = vfUser.totalBalance.plus(amount);
  vfUser.totalClaimedBalance = vfUser.totalClaimedBalance.plus(claimAmount);
  vfUser.totalBalancePlusTotalClaimedBalance = vfUser.totalBalance.plus(vfUser.totalClaimedBalance);
  vfUser.save();

  const vfOutcomeUser = assertVfOutcomeUserEntity(vfOutcome, user, vfUser);
  vfOutcomeUser.totalBalance = vfOutcomeUser.totalBalance.plus(amount);
  vfOutcomeUser.totalWeightedBalance = vfOutcomeUser.totalWeightedBalance.plus(amountTimesBeta);
  vfOutcomeUser.totalClaimedBalance = vfOutcomeUser.totalClaimedBalance.plus(claimAmount);
  vfOutcomeUser.totalBalancePlusTotalClaimedBalance = vfOutcomeUser.totalBalance.plus(vfOutcomeUser.totalClaimedBalance);
  vfOutcomeUser.save();

  const vfOutcomeTimeslotUser = assertVfOutcomeTimeslotUserEntity(vfOutcome, user, vfOutcomeTimeslot, vfOutcomeUser);
  vfOutcomeTimeslotUser.balance = vfOutcomeTimeslotUser.balance.plus(amount);
  vfOutcomeTimeslotUser.claimedBalance = vfOutcomeTimeslotUser.claimedBalance.plus(claimAmount);
  vfOutcomeTimeslotUser.balancePlusClaimedBalance = vfOutcomeTimeslotUser.balance.plus(vfOutcomeTimeslotUser.claimedBalance);
  vfOutcomeTimeslotUser.save();
}

export function handleVirtualFloorCancellationUnresolvable(event: VirtualFloorCancellationUnresolvableEvent): void {
  const vf = loadExistentVfEntity(event.params.vfId);
  const creator = loadExistentEntity<User>(User.load, vf.creator);
  adjustUserConcurrentVirtualFloors(creator, -1);
  vf.state = VirtualFloorState__Claimable_Refunds_ResolvableNever;
  vf.resolutionOrCancellationTxHash = event.transaction.hash;
  vf.resolutionOrCancellationTxTimestamp = event.block.timestamp;
  vf.save();
}

export function handleVirtualFloorCancellationFlagged(event: VirtualFloorCancellationFlaggedEvent): void {
  const vf = loadExistentVfEntity(event.params.vfId);
  const creator = loadExistentEntity<User>(User.load, vf.creator);
  adjustUserConcurrentVirtualFloors(creator, -1);
  vf.state = VirtualFloorState__Claimable_Refunds_Flagged;
  vf.resolutionOrCancellationTxHash = event.transaction.hash;
  vf.resolutionOrCancellationTxTimestamp = event.block.timestamp;
  vf.flaggingReason = event.params.reason;
  vf.save();
}

export function handleVirtualFloorResolution(event: ethereum.Event, vfId: BigInt, resolutionType: i32, winningOutcomeIndex: i32, winnerProfits: BigInt): void {
  const vf = loadExistentVfEntity(vfId);
  const creator = loadExistentEntity<User>(User.load, vf.creator);
  adjustUserConcurrentVirtualFloors(creator, -1);
  switch (resolutionType) {
    case VirtualFloorResolutionType.NoWinners:
      vf.state = VirtualFloorState__Claimable_Refunds_ResolvedNoWinners;
      break;
    case VirtualFloorResolutionType.Winners:
      vf.state = VirtualFloorState__Claimable_Payouts;
      break;
  }
  vf.resolutionOrCancellationTxHash = event.transaction.hash;
  vf.resolutionOrCancellationTxTimestamp = event.block.timestamp;
  vf.winningOutcome = loadExistentVfOutcomeEntity(vfId, winningOutcomeIndex).id;
  vf.winnerProfits = bigIntFixedPointToBigDecimal(winnerProfits, loadExistentEntity<PaymentToken>(PaymentToken.load, vf.paymentToken).decimals);
  vf.save();
}

export function handleVirtualFloorResolutions(event: VirtualFloorResolutionsEvent): void {
  const vf = loadExistentVfEntity(event.params.vfId);
  let winningOutcomeIndexFlagsCopy = event.params.winningOutcomeIndexFlags;
  const mask = BigInt.fromI32(1);
  let winningOutcomeIndex: i32;
  for (winningOutcomeIndex = 0; winningOutcomeIndex < vf.nOutcomes; winningOutcomeIndex++) {
    if (winningOutcomeIndexFlagsCopy.bitAnd(mask).notEqual(BigInt.zero())) {
      break;
    }
    winningOutcomeIndexFlagsCopy = winningOutcomeIndexFlagsCopy.rightShift(1);
  }
  assert(winningOutcomeIndexFlagsCopy.equals(BigInt.fromI32(1)), 'Broken: winningOutcomeIndexFlags.equals(BigInt.fromI32(1))');
  assert(winningOutcomeIndex < vf.nOutcomes, 'Broken: winningOutcomeIndex < vf.nOutcomes');
  handleVirtualFloorResolution(event, event.params.vfId, event.params.resolutionType, winningOutcomeIndex, event.params.winnerProfits);
}

function adjustUserConcurrentVirtualFloors(user: User, adjustment: i32): void {
  user.concurrentVirtualFloors = user.concurrentVirtualFloors.plus(BigInt.fromI32(adjustment));
  user.save();
}
