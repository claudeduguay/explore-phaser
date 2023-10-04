import { fireEmitter } from "../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargetFireBehavior extends BaseTargeCloudBehavior {

  constructor() {
    super('fire', fireEmitter)
  }
}
