import { shockEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeShockBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "spark", shockEmitter)
  }
}
