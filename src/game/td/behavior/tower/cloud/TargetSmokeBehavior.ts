import { smokeEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSmokeBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "smoke", smokeEmitter)
  }
}
