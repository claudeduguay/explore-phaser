import { snowEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSnowBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "snow", snowEmitter, (enemy: TDEnemy) => new TimedDamageEffect(enemy, 2000, "Cold", tower))
  }
}