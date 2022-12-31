import {
  ClassicVirtualFloor as ClassicVf,
  Opponent as VfOpponent,
  ResultSource as VfResultSource
} from '../../../../generated/schema';
import { createNewEntity } from '../../entity-lib';

export function createVfOpponentEntity(vf: ClassicVf, opponentIndex: i32, title: string, image: string): VfOpponent {
  const id = `${vf.id}-${opponentIndex}`;
  const vfOpponent = createNewEntity<VfOpponent>(VfOpponent.load, id);
  vfOpponent.virtualFloor = vf.id;
  vfOpponent.title = title;
  vfOpponent.image = image;
  vfOpponent.save();
  return vfOpponent;
}

export function createVfResultSourceEntity(vf: ClassicVf, resultSourceIndex: i32, title: string, url: string): VfResultSource {
  const id = `${vf.id}-${resultSourceIndex}`;
  const vfResultSource = createNewEntity<VfResultSource>(VfResultSource.load, id);
  vfResultSource.virtualFloor = vf.id;
  vfResultSource.title = title;
  vfResultSource.url = url;
  vfResultSource.save();
  return vfResultSource;
}
