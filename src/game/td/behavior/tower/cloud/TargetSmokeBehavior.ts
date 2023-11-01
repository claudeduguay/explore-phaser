import { smokeEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSmokeBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "smoke", smokeEmitter,
      (enemy: TDEnemy) => new TimedDamageEffect(
        tower, enemy, tower.model.damage.health.smoke.duration || 0, "Blinded"))
  }
}
