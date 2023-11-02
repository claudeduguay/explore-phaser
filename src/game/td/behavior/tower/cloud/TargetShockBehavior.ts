import { shockEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeShockBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "spark", shockEmitter,
      (enemy: TDEnemy) => new TimedDamageEffect(
        tower, enemy, tower.model.damage.health.duration || 0))
  }
}
