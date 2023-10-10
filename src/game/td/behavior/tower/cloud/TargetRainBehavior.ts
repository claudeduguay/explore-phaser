import { rainEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeRainBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "rain", rainEmitter, (enemy: TDEnemy) => new TimedDamageEffect(tower, enemy, 2000, "Wet"))
  }
}
