import { rockEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeRockBehavior extends BaseTargeCloudBehavior {
  constructor(tower: TDTower) {
    super(tower, "rock", rockEmitter)
  }
}
