import { poisonEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargePoisonBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("smoke", poisonEmitter, (tower: TDTower) => new TimedDamageEffect(3000, "Poison", tower))
  }
}
