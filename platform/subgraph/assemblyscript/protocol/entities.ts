/* eslint-disable @typescript-eslint/ban-types */
import {
  Address,
  BigDecimal,
  BigInt, Entity,
  store
} from '@graphprotocol/graph-ts';
import {
  BaseAbstractVf,
  Category,
  ClassicVirtualFloor as ClassicVf,
  RandomVirtualFloor as DiceVf,
  RouletteVirtualFloor as RouletteVf,
  Outcome as VfOutcome,
  OutcomeTimeslot as VfOutcomeTimeslot,
  Subcategory,
  User,
  UserOutcome as VfOutcomeUser,
  UserOutcomeTimeslot as VfOutcomeTimeslotUser,
  UserVirtualFloor as VfUser
} from '../../../generated/schema';
import { assertFieldEqual, createNewEntity, loadExistentEntity } from '../entity-lib';

export function assertVfOutcomeTimeslotEntity(
  vfOutcome: VfOutcome,
  tokenId: BigInt,
  beta: BigDecimal,
): VfOutcomeTimeslot {
  const id = genVfOutcomeTimeslotEntityId(tokenId);
  const loaded = VfOutcomeTimeslot.load(id);
  if (loaded == null) {
    const created = new VfOutcomeTimeslot(id);
    {
      created.outcome = vfOutcome.id;
      created.tokenId = tokenId;
      created.beta = beta;
    }
    {
      created.totalSupply = BigDecimal.zero();
    }
    created.save();
    return created;
  } else {
    {
      assertFieldEqual('VfOutcomeTimeslot', id, 'outcome', loaded.outcome, vfOutcome.id);
      assertFieldEqual('VfOutcomeTimeslot', id, 'tokenId', loaded.tokenId, tokenId);
      assertFieldEqual('VfOutcomeTimeslot', id, 'beta', loaded.beta, beta);
    }
    return loaded;
  }
}

export function assertUserEntity(addr: Address): User {
  const id = addr.toHex();
  const loaded = User.load(id);
  if (loaded == null) {
    const created = new User(id);
    // eslint-disable-next-line no-empty
    {
    }
    {
      created.maxConcurrentVirtualFloors = BigInt.zero();
      created.concurrentVirtualFloors = BigInt.zero();
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


export function assertVfOutcomeUserEntity(vfOutcome: VfOutcome, user: User, vfUser: VfUser): VfOutcomeUser {
  const id = `${vfOutcome.id}-${user.id}`;
  const loaded = VfOutcomeUser.load(id);
  if (loaded == null) {
    const created = new VfOutcomeUser(id);
    {
      created.outcome = vfOutcome.id;
      created.user = user.id;
      created.userVirtualFloor = vfUser.id;
    }
    {
      created.totalBalance = BigDecimal.zero();
      created.totalClaimedBalance = BigDecimal.zero();
      created.totalBalancePlusTotalClaimedBalance = BigDecimal.zero();
      created.totalWeightedBalance = BigDecimal.zero();
    }
    created.save();
    return created;
  } else {
    {
      assertFieldEqual('VfOutcomeUser', id, 'outcome', loaded.outcome, vfOutcome.id);
      assertFieldEqual('VfOutcomeUser', id, 'user', loaded.user, user.id);
      assertFieldEqual('VfOutcomeUser', id, 'userVirtualFloor', loaded.userVirtualFloor, vfUser.id);
    }
    return loaded;
  }
}

export function assertVfOutcomeTimeslotUserEntity(
  vfOutcome: VfOutcome,
  user: User,
  vfOutcomeTimeslot: VfOutcomeTimeslot,
  vfOutcomeUser: VfOutcomeUser,
): VfOutcomeTimeslotUser {
  {
    assertFieldEqual('VfOutcomeTimeslot', vfOutcomeTimeslot.id, 'outcome', vfOutcomeTimeslot.outcome, vfOutcome.id);
    assertFieldEqual('VfOutcomeUser', vfOutcomeUser.id, 'outcome', vfOutcomeUser.outcome, vfOutcome.id);
    assertFieldEqual('VfOutcomeUser', vfOutcomeUser.id, 'user', vfOutcomeUser.user, user.id);
  }
  const id = `${vfOutcomeTimeslot.id}-${user.id}`;
  const loaded = VfOutcomeTimeslotUser.load(id);
  if (loaded == null) {
    const created = new VfOutcomeTimeslotUser(id);
    {
      created.user = user.id;
      created.outcome = vfOutcome.id;
      created.userOutcome = vfOutcomeUser.id;
      created.outcomeTimeslot = vfOutcomeTimeslot.id;
    }
    {
      created.balance = BigDecimal.zero();
      created.claimedBalance = BigDecimal.zero();
      created.balancePlusClaimedBalance = BigDecimal.zero();
    }
    created.save();
    return created;
  } else {
    {
      assertFieldEqual('VfUserOutcomeTimeslot', id, 'user', loaded.user, user.id);
      assertFieldEqual('VfUserOutcomeTimeslot', id, 'outcome', loaded.outcome, vfOutcome.id);
      assertFieldEqual('VfUserOutcomeTimeslot', id, 'userOutcome', loaded.userOutcome, vfOutcomeUser.id);
      assertFieldEqual('VfUserOutcomeTimeslot', id, 'outcomeTimeslot', loaded.outcomeTimeslot, vfOutcomeTimeslot.id);
    }
    return loaded;
  }
}

export function assertCategoryEntity(metadataCategory: string): Category {
  // encodeURIComponent is implemented in AssemblyScript,
  // see https://github.com/AssemblyScript/assemblyscript/wiki/Status-and-Roadmap#globals
  const id = encodeURIComponent(metadataCategory);
  const loaded = Category.load(id);
  if (loaded == null) {
    const created = new Category(id);
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

export function assertSubcategoryEntity(category: Category, metadataSubcategory: string): Subcategory {
  // encodeURIComponent is implemented in AssemblyScript,
  // see https://github.com/AssemblyScript/assemblyscript/wiki/Status-and-Roadmap#globals
  const subid = encodeURIComponent(metadataSubcategory);

  // Note: We use "/" as a separator instead of "-", since category and subcategory
  // might contain "-", but they will not contain "/" because they have been percent-encoded,
  // so by using "/" we rule out collisions.
  // Moreover, "/" is semantically suitable in this particular context.
  const id = `${category.id}/${subid}`;

  const loaded = Subcategory.load(id);
  if (loaded == null) {
    const created = new Subcategory(id);
    {
      created.category = category.id;
      created.subid = subid;
    }
    created.save();
    return created;
  } else {
    {
      assertFieldEqual('Subcategory', id, 'category', loaded.category, category.id);
      assertFieldEqual('Subcategory', id, 'subid', loaded.subid, subid);
    }
    return loaded;
  }
}

/**
 * This assertEntity function looks different from the rest,
 * but this is actually how we want all the others to look.
 */
export function assertVfUserEntity(vf: Entity, user: User): VfUser {
  const id = `${vf.getString('id')}-${user.id}`;
  const loaded = VfUser.load(id);
  if (loaded == null) {
    const created = new VfUser(id);
    {
      created.virtualFloor = vf.getString('id');
      created.user = user.id;
    }
    {
      created.totalBalance = BigDecimal.zero();
      created.totalClaimedBalance = BigDecimal.zero();
      created.totalBalancePlusTotalClaimedBalance = BigDecimal.zero();
    }
    created.save();
    return created;
  } else {
    {
      assertFieldEqual('VfUser', id, 'virtualFloor', loaded.virtualFloor, vf.getString('id'));
      assertFieldEqual('VfUser', id, 'user', loaded.user, user.id);
    }
    return loaded;
  }
}

export function createVfOutcomeEntity(vf: Entity, outcomeIndex: i32, title: string): VfOutcome {
  const id = `${vf.getString('id')}-${outcomeIndex}`;
  const vfOutcome = createNewEntity<VfOutcome>(VfOutcome.load, id);
  vfOutcome.virtualFloor = vf.getString('id');
  vfOutcome.title = title;
  vfOutcome.index = outcomeIndex;
  vfOutcome.totalSupply = BigDecimal.zero();
  vfOutcome.totalWeightedSupply = BigDecimal.zero();
  vfOutcome.save();
  return vfOutcome;
}

export function genVfEntityId(vfId: BigInt): string {
  return vfId.toHex();
}

export function genVfOutcomeTimeslotEntityId(tokenId: BigInt): string {
  return tokenId.toHex();
}

export function loadExistentVfOutcomeEntity(vfId: BigInt, outcomeIndex: i32): VfOutcome {
  const vfEntity = loadExistentVfEntity(vfId);
  return loadExistentEntity<VfOutcome>(VfOutcome.load, `${vfEntity.id}-${outcomeIndex}`);
}

// Unfortunately neither does graph-cli generate a common superclass/interface corresponding to `Vf` interface,
// nor does it support defining a union-type AbstractVf = ClassicVf | RandomVf | RouletteVf
// Therefore we come up with the following hack/workaround:
// 1. First we declare a dummy @entity BaseAbstractVf that simply mirrors all the fields defined in the Vf interface.
//    This forces graph-cli to generate a BaseAbstractVf AssemblyScript-wrapper.
// 2. Then we declare a class AbstractVf that extends the generated BaseAbstractVf, and on it we add a `save` method
//    that knows how to save itself based on its own Vf-type.
// 3. Whenever we want to pass `vf` that is a `ClassicVf`, `RandomVf` or `RouletteVf` as an `AbstractVf`-typed argument,
//    we perform a `changetype<AbstractVf>(vf)`, safe in the knowledge that all fields defined on `AbstractVf` exist
//    on either of the more speficic classes.
export class AbstractVf extends BaseAbstractVf {

  entityName: string;

  save(): void {
    if (this.entityName == 'ClassicVirtualFloor') {
      changetype<ClassicVf>(this).save();
    } else if (this.entityName == 'RandomVirtualFloor') {
      changetype<DiceVf>(this).save();
    } else if (this.entityName == 'RouletteVirtualFloor') {
      changetype<RouletteVf>(this).save();
    } else {
      assert(false, `Unknown entityName: ${this.entityName}`);
    }
  }
}

export function loadExistentVfEntity(vfId: BigInt): AbstractVf {
  return loadExistentVfEntityId(genVfEntityId(vfId));
}

export function loadExistentVfEntityId(id: string): AbstractVf {
  let entity: Entity | null;
  let vf: AbstractVf | null = null;

  entity = store.get('ClassicVirtualFloor', id);
  if (entity != null) {
    vf = changetype<AbstractVf>(entity);
    vf.entityName = 'ClassicVirtualFloor';
  }

  entity = store.get('RandomVirtualFloor', id);
  if (entity != null) {
    vf = changetype<AbstractVf>(entity);
    vf.entityName = 'RandomVirtualFloor';
  }

  entity = store.get('RouletteVirtualFloor', id);
  if (entity != null) {
    vf = changetype<AbstractVf>(entity);
    vf.entityName = 'RouletteVirtualFloor';
  }

  return assert(vf, `loadExistentEntity: Expected ClassicVirtualFloor, RandomVirtualFloor or RouletteVirtualFloor entity ${id} to already exist`);
}