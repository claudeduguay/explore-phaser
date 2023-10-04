import { iceEmitter } from "../../emitter/ParticleConfig"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetIceBehavior extends BaseTargetSprayBehavior {

  constructor() {
    super('ice', iceEmitter)
  }
}
