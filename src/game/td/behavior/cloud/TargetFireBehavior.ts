import { fireEmitter } from "../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargetIceBehavior extends BaseTargeCloudBehavior {

  constructor() {
    super('fire', fireEmitter)
  }
}
