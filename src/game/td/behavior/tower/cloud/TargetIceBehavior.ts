import { iceEmitter } from "../../../emitter/ParticleConfig"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeIceBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "ice", iceEmitter, (enemy: TDEnemy) => new TimedDamageEffect(enemy, 3000, "Cold", tower))
  }
}