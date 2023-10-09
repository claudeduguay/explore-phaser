import { snowEmitter } from "../../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSnowBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("snow", snowEmitter)
  }
}
