import { snowEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSnowBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "snow", snowEmitter,
      (enemy: TDEnemy) => new TimedDamageEffect(
        tower, enemy, tower.model.damage.health.snow.duration || 0, "Cold"))
  }
}
