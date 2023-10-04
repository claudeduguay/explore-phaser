import { iceEmitter } from "../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeIceBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("ice", iceEmitter)
  }
}
