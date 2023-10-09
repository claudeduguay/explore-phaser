import { iceEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TimedDamageEffect from "../../enemy/TimedDamageEffect"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeIceBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("ice", iceEmitter, (tower: TDTower) => new TimedDamageEffect(3000, "Cold", tower))
  }
}
