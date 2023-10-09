import { rainEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeRainBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("rain", rainEmitter, (tower: TDTower) => new TimedDamageEffect(2000, "Wet", tower))
  }
}
