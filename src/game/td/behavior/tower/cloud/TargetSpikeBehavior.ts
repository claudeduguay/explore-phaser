import { spikeEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeStunBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "spike", spikeEmitter,
      (enemy: TDEnemy) => new TimedDamageEffect(
        tower, enemy, tower.model.damage.health.duration || 0, tower.model.damage.health.type))
  }
}
