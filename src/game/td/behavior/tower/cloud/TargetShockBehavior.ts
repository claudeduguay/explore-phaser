import { shockEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeShockBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("spark", shockEmitter, (tower: TDTower) => new TimedDamageEffect(3000, "Electrified", tower))
  }
}
