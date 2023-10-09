import { snowEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSnowBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("snow", snowEmitter, (tower: TDTower) => new TimedDamageEffect(2000, "Cold", tower))
  }
}
