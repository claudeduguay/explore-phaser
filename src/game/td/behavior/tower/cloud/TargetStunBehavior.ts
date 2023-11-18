import { stunEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import ApplyAffect from "../../../entity/tower/affect/ApplyAffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeStunBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "stun", stunEmitter,
      (enemy: TDEnemy) => new ApplyAffect(tower, enemy))
  }
}
