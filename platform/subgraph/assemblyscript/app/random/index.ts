import {
  BigInt
} from '@graphprotocol/graph-ts';
import {
  VirtualFloorCreation as RandomVirtualFloorCreationEvent
} from '../../../../generated/RandomDoubleDiceApp/RandomDoubleDiceApp';
import {
  RandomVirtualFloor as DiceVf,
  ProtocolVirtualFloorCreationEventEntity
} from '../../../../generated/schema';
import { createNewEntity, loadExistentEntity } from '../../entity-lib';
import {
  AbstractVf,
  assertCategoryEntity,
  assertSubcategoryEntity,
  createVfOutcomeEntity,
  genVfEntityId
} from '../../protocol/entities';
import { handleCommonVirtualFloorCreation } from '../../protocol/main';
export function handleRandomVirtualFloorCreation(event: RandomVirtualFloorCreationEvent): void {
  const vfId = genVfEntityId(event.params.vfId);

  const vf = createNewEntity<DiceVf>(DiceVf.load, vfId);

  handleCommonVirtualFloorCreation(vfId, changetype<AbstractVf>(vf));

  const baseEvent = loadExistentEntity<ProtocolVirtualFloorCreationEventEntity>(ProtocolVirtualFloorCreationEventEntity.load, vfId);

  vf.isTest = false;

  const category = assertCategoryEntity('dice');
  const subcategory = assertSubcategoryEntity(category, 'dice');
  vf.category = category.id;
  vf.subcategory = subcategory.id;

  vf.title = 'Dice game';
  vf.description = 'Guess number between 1 and 6';
  vf.isListed = true;

  vf.allText = 'dice';

  vf.randomNumber = BigInt.fromI32(12345);

  // VirtualFloor entity must be saved before calling createVfOutcomeEntity
  vf.save();

  assert(baseEvent.params_nOutcomes == 6);

  for (let i = 0; i < 6; i++) {
    createVfOutcomeEntity(vf, i, `№ ${i + 1}`);
  }

}