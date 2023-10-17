import { fireEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargetFireBehavior extends BaseTargeCloudBehavior {

  constructor(tower: TDTower) {
    super(tower, 'fire', fireEmitter, (enemy: TDEnemy) => new TimedDamageEffect(
      tower, enemy, tower.model.damage.fire.duration || 0, "Burn"))
  }
}
