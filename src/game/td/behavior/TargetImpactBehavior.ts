import { impactEmitter } from "../emitter/ParticleConfig"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetIceBehavior extends BaseTargetSprayBehavior {

  constructor() {
    super('slash', impactEmitter)
  }
}
