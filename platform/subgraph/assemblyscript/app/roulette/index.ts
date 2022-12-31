/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */
// Note: Despite the .ts file extension, this is AssemblyScript not TypeScript!

import {
  BigDecimal,
  ethereum,
} from '@graphprotocol/graph-ts';
import {
  RouletteSessionCreation,
} from '../../../../generated/RouletteDoubleDiceApp/RouletteDoubleDiceApp';
import {
  RouletteSession,
} from '../../../../generated/schema';
import { createNewEntity } from '../../entity-lib';
import {
  genVfEntityId
} from '../../protocol/entities';
import { createRouletteVfEntity } from './entities';


export function handleRouletteSessionCreation(event: RouletteSessionCreation): void {
  
  const session = createNewEntity<RouletteSession>(RouletteSession.load, event.params.tableId.toHex());

  session.tableId = event.params.tableId;
  session.tOpen = event.params.tOpen;
  session.tResolve = event.params.tResolve;
  session.tOpen = event.params.tOpen;

  const decodedMetadata = ethereum.decode('(string,string)', event.params.metadata.data);

  if (decodedMetadata !== null) {

    const decoded = decodedMetadata.toTuple();

    const tableName = decoded[0].toString();
    const environmentName = decoded[1].toString();

    session.tableName = tableName;
    session.environmentName = environmentName;
  }
  const bonusAmounts = event.params.bonusAmounts;
  const bonusAmountsInBigDecimal: BigDecimal[] = [];

  for (let i = 0; i < bonusAmounts.length; i++) {
    const bonusAmount = new BigDecimal(bonusAmounts[i]);
    bonusAmountsInBigDecimal.push(bonusAmount);
  }

  session.vfIds = event.params.vfIds;
  session.bonusAmounts = bonusAmountsInBigDecimal;

  session.save();

  for (let i = 0; i < event.params.vfIds.length; i++) {
    const vfId = genVfEntityId(event.params.vfIds[i]);
    createRouletteVfEntity(session, vfId);
  }
  
}


