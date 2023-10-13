import { forceEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetForceBehavior extends BaseTargetSprayBehavior {

  constructor(tower: TDTower) {
    super(tower, 'slash', forceEmitter)
  }
}
