import { iceEmitter } from "../../emitter/ParticleConfig"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetFreezeBehavior extends BaseTargetSprayBehavior {

  constructor() {
    super('ice', iceEmitter)
  }
}
