import { stunEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedStopEffect from "../../enemy/TimedStopEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeStunBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "stun", stunEmitter,
      (enemy: TDEnemy) => new TimedStopEffect(
        tower,
        enemy,
        tower.model.damage.health.duration || 0,
        tower.model.damage.health.cooldown || 0))
  }
}
