import { rockEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeRockBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "rock", rockEmitter, (enemy: TDEnemy) => new TimedDamageEffect(
      tower, enemy, tower.model.damage.rock.duration || 0, "Rock"))
  }
}
