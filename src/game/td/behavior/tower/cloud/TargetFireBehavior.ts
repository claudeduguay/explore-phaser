import { fireEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargetFireBehavior extends BaseTargeCloudBehavior {

  constructor(tower: TDTower) {
    super(tower, 'fire', fireEmitter)
  }
}
