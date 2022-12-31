/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable indent */
// Note: Despite the .ts file extension, this is AssemblyScript not TypeScript!

import {
  Bytes,
  store
} from '@graphprotocol/graph-ts';
import {
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent
} from '../../../generated/DoubleDiceProtocol/DoubleDiceProtocol';
import {
  Role,
  RoleUser
} from '../../../generated/schema';
import {
  assertUserEntity
} from './entities';
import {
  createNewEntity,
  loadExistentEntity
} from '../entity-lib';

function assertRoleEntity(roleHash: Bytes): Role {
  let id = roleHash.toHex();
  if (id == '0x0000000000000000000000000000000000000000000000000000000000000000') {
    id = 'DEFAULT_ADMIN_ROLE';
  } else if (id == '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929') {
    id = 'OPERATOR_ROLE';
  }
  const loaded = Role.load(id);
  if (loaded == null) {
    const created = new Role(id);
    // eslint-disable-next-line no-empty
    {
    }
    created.save();
    return created;
  } else {
    // eslint-disable-next-line no-empty
    {
    }
    return loaded;
  }
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  const role = assertRoleEntity(event.params.role);
  const user = assertUserEntity(event.params.account);
  const roleUser = createNewEntity<RoleUser>(RoleUser.load, `${role.id}-${user.id}`);
  roleUser.role = role.id;
  roleUser.user = user.id;
  roleUser.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  const role = assertRoleEntity(event.params.role);
  const user = assertUserEntity(event.params.account);
  const roleUser = loadExistentEntity<RoleUser>(RoleUser.load, `${role.id}-${user.id}`);
  // https://thegraph.com/docs/en/developer/assemblyscript-api/#removing-entities-from-the-store
  store.remove('RoleUser', roleUser.id);
}
