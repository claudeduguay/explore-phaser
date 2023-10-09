import { fireEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargetFireBehavior extends BaseTargeCloudBehavior {

  constructor() {
    super('fire', fireEmitter, (tower: TDTower) => new TimedDamageEffect(3000, "Burn", tower))
  }
}
