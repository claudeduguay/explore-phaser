import { smokeEmitter } from "../../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSmokeBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("smoke", smokeEmitter)
  }
}
