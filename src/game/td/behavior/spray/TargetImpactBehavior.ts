import { impactEmitter } from "../../emitter/ParticleConfig"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetImpactBehavior extends BaseTargetSprayBehavior {

  constructor() {
    super('slash', impactEmitter)
  }
}
