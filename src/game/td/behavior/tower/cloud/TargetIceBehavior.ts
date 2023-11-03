import { iceEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeIceBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "ice", iceEmitter)
  }
}
