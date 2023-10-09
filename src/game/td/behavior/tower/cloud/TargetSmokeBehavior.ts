import { smokeEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSmokeBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("smoke", smokeEmitter, (tower: TDTower) => new TimedDamageEffect(3000, "Blinded", tower))
  }
}
