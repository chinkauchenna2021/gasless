/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */
// Note: Despite the .ts file extension, this is AssemblyScript not TypeScript!

import {
  BigInt
} from '@graphprotocol/graph-ts';
import {
  CreationQuotaAdjustments as CreationQuotaAdjustmentsEvent,
  ResultUpdate as ResultUpdateEvent,
  VirtualFloorCreation as ClassicVirtualFloorCreationEvent
} from '../../../../generated/ClassicDoubleDiceApp/ClassicDoubleDiceApp';
import {
  ClassicVirtualFloor as ClassicVf,
  ProtocolVirtualFloorCreationEventEntity
} from '../../../../generated/schema';
import { ResultUpdateAction } from '../../../../lib/helpers/sol-enums';
import { FIRST_NON_TEST_VF_BLOCK } from '../../../generated/env';
import { createNewEntity, loadExistentEntity } from '../../entity-lib';
import {
  AbstractVf,
  assertCategoryEntity,
  assertSubcategoryEntity,
  assertUserEntity,
  createVfOutcomeEntity,
  genVfEntityId,
  loadExistentVfOutcomeEntity
} from '../../protocol/entities';
import { handleCommonVirtualFloorCreation } from '../../protocol/main';
import {
  VirtualFloorState__Active_ResultChallenged,
  VirtualFloorState__Active_ResultSet
} from '../../protocol/state';
import { bigIntFixedPointToBigDecimal } from '../../utils';
import { CHALLENGE_WINDOW_DURATION, SET_WINDOW_DURATION } from './constants';
import { createVfOpponentEntity, createVfResultSourceEntity } from './entities';
import { decodeMetadata } from './legacy/metadata';
import {
  resultUpdateActionOrdinalToSolEnum,
  resultUpdateActionSolEnumToGraphEnum
} from './result-update-action';

const firstNonTestVfBlock = BigInt.fromString(FIRST_NON_TEST_VF_BLOCK);

export function handleClassicVirtualFloorCreation(event: ClassicVirtualFloorCreationEvent): void {
  const vfId = genVfEntityId(event.params.vfId);

  const vf = createNewEntity<ClassicVf>(ClassicVf.load, vfId);

  handleCommonVirtualFloorCreation(vfId, changetype<AbstractVf>(vf));

  const baseEvent = loadExistentEntity<ProtocolVirtualFloorCreationEventEntity>(ProtocolVirtualFloorCreationEventEntity.load, vfId);

  vf.tResultSetMin = baseEvent.params_tResolve;
  vf.tResultSetMax = baseEvent.params_tResolve.plus(SET_WINDOW_DURATION); // ToDo: Include this as event param tResultSetMax

  vf.tOpen = event.params.tOpen;
  vf.betaOpen = bigIntFixedPointToBigDecimal(event.params.betaOpen_e18, 18);

  const metadata = decodeMetadata(event.params.metadata);

  vf.isTest = metadata.subcategory == 'test' || event.block.number.lt(firstNonTestVfBlock);

  const category = assertCategoryEntity(metadata.category);
  vf.category = category.id;

  const subcategory = assertSubcategoryEntity(category, metadata.subcategory);
  vf.subcategory = subcategory.id;

  vf.title = metadata.title;
  vf.description = metadata.description;
  vf.isListed = metadata.isListed;
  vf.discordChannelId = metadata.discordChannelId;

  const allTextTokens: string[] = [
    metadata.title,
    metadata.description,
    metadata.category,
    metadata.subcategory,
  ];
  for (let i = 0; i < metadata.opponents.length; i++) {
    allTextTokens.push(metadata.opponents[i].title);
  }
  for (let i = 0; i < metadata.resultSources.length; i++) {
    allTextTokens.push(metadata.resultSources[i].title);
  }
  for (let i = 0; i < metadata.outcomes.length; i++) {
    allTextTokens.push(metadata.outcomes[i].title);
  }
  vf.allText = allTextTokens.join(' ');


  // VirtualFloor entity must be saved before calling createVfOpponentEntity, createVfResultSourceEntity, createVfOutcomeEntity
  vf.save();


  for (let i = 0; i < metadata.opponents.length; i++) {
    createVfOpponentEntity(vf, i, metadata.opponents[i].title, metadata.opponents[i].image);
  }

  for (let i = 0; i < metadata.resultSources.length; i++) {
    createVfResultSourceEntity(vf, i, metadata.resultSources[i].title, metadata.resultSources[i].url);
  }

  assert(
    metadata.outcomes.length == baseEvent.params_nOutcomes,
    `metadata.outcomes.length = ${metadata.outcomes.length} != event.params.nOutcomes = ${baseEvent.params_nOutcomes}`
  );

  for (let i = 0; i < metadata.outcomes.length; i++) {
    createVfOutcomeEntity(vf, i, metadata.outcomes[i].title);
  }
}


export function handleResultUpdate(event: ResultUpdateEvent): void {
  const vf = assert(ClassicVf.load(genVfEntityId(event.params.vfId)));

  // ToDo: Overwrite this every time result is updated,
  // or write only final-result in it?
  // By overwriting every time, it is not possible to query Graph for history of what happened,
  // but only for latest result.
  vf.winningOutcome = loadExistentVfOutcomeEntity(event.params.vfId, event.params.outcomeIndex).id;

  const action = resultUpdateActionOrdinalToSolEnum(event.params.action);

  switch (action) {
    case ResultUpdateAction.CreatorSetResult:
      vf.state = VirtualFloorState__Active_ResultSet;
      vf.tResultChallengeMax = event.block.timestamp.plus(CHALLENGE_WINDOW_DURATION); // ToDo: Include this as event param tChallengeMax
      break;
    case ResultUpdateAction.SomeoneChallengedSetResult: {
      vf.state = VirtualFloorState__Active_ResultChallenged;
      vf.challenger = assertUserEntity(event.params.operator).id;
      break;
    }
    case ResultUpdateAction.OperatorFinalizedUnsetResult:
    case ResultUpdateAction.SomeoneConfirmedUnchallengedResult:
    case ResultUpdateAction.OperatorFinalizedChallenge:
      // No need to handle these, as these will all result in a separate `VirtualFloorResolution` event,
      // which will be handled by `handleVirtualFloorResultion`
      break;
  }

  vf.resultUpdateAction = resultUpdateActionSolEnumToGraphEnum(action);

  vf.save();
}

export function handleCreationQuotaAdjustments(event: CreationQuotaAdjustmentsEvent): void {
  const adjustments = event.params.adjustments;
  for (let i = 0; i < adjustments.length; i++) {
    const creator = assertUserEntity(adjustments[i].creator);
    creator.maxConcurrentVirtualFloors = creator.maxConcurrentVirtualFloors.plus(adjustments[i].relativeAmount);
    creator.save();
  }
}
