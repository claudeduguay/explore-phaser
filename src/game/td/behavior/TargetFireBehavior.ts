import { fireEmitter } from "../emitter/ParticleConfig"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetFireBehavior extends BaseTargetSprayBehavior {

  constructor() {
    super('fire', fireEmitter)
  }
}
