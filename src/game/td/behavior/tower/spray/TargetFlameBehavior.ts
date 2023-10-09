import { flameEmitter } from "../../../emitter/ParticleConfig"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetFlameBehavior extends BaseTargetSprayBehavior {

  constructor() {
    super('fire', flameEmitter)
  }
}
