import { rainEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeRainBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "rain", rainEmitter)
  }
}
