/* eslint-disable @typescript-eslint/ban-types */

interface EntityLike {
  save(): void
}

type LoadEntity<T> = (id: string) => T | null

export function createNewEntity<T extends EntityLike>(load: LoadEntity<T>, id: string): T {
  let entity = load(id);
  assert(entity == null, `createNewEntity: Expected entity ${id} to NOT already exist`);
  entity = instantiate<T>(id);
  return entity;
}

export function loadExistentEntity<T extends EntityLike>(load: LoadEntity<T>, id: string): T {
  return assert(load(id), `loadExistentEntity: Expected entity ${id} to already exist`);
}

export function assertFieldEqual<T>(entityName: string, id: string, fieldName: string, actualFieldValue: T, expectedFieldValue: T): void {
  // Note: Important to use == until === becomes supported
  assert(actualFieldValue == expectedFieldValue, `${entityName}(${id}).${fieldName} == ${actualFieldValue} != ${expectedFieldValue}`);
}
