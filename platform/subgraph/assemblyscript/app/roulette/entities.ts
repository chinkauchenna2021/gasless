/* eslint-disable @typescript-eslint/ban-types */

import { ProtocolVirtualFloorCreationEventEntity, RouletteSession, RouletteVirtualFloor } from '../../../../generated/schema';
import { createNewEntity, loadExistentEntity } from '../../entity-lib';
import { AbstractVf, assertCategoryEntity, assertSubcategoryEntity, createVfOutcomeEntity } from '../../protocol/entities';
import { handleCommonVirtualFloorCreation } from '../../protocol/main';


export function createRouletteVfEntity(session: RouletteSession, vfId: string): RouletteVirtualFloor {

  const vf = createNewEntity<RouletteVirtualFloor>(RouletteVirtualFloor.load, vfId);

  handleCommonVirtualFloorCreation(vfId, changetype<AbstractVf>(vf));

  const baseEvent = loadExistentEntity<ProtocolVirtualFloorCreationEventEntity>(ProtocolVirtualFloorCreationEventEntity.load, vfId);

  vf.isTest = false;

  const category = assertCategoryEntity('roulette');
  const subcategory = assertSubcategoryEntity(category, 'roulette');

  vf.category = category.id;
  vf.subcategory = subcategory.id;

  vf.title = 'Roulette game';
  vf.description = 'Place bet on number between 0 and 36';
  vf.isListed = true;

  vf.tOpen = baseEvent.params_tOpen;

  vf.tableId = session.tableId;


  vf.tableName = session.tableName;
  vf.environmentName = session.environmentName;

  vf.allText = [session.tableName, session.environmentName].join(' ');

  vf.session = session.id;

  // VirtualFloor entity must be saved before calling createVfOutcomeEntity
  vf.save();

  for (let i = 0; i < baseEvent.params_nOutcomes; i++) {
    createVfOutcomeEntity(vf, i, `№ ${i + 1}`);
  }

  return vf;
}