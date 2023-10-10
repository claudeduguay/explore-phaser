import { impactEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetImpactBehavior extends BaseTargetSprayBehavior {

  constructor(tower: TDTower) {
    super(tower, 'slash', impactEmitter)
  }
}
