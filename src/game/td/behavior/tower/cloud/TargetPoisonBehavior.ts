import { poisonEmitter } from "../../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargePoisonBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("smoke", poisonEmitter)
  }
}
