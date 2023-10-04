import { freezeEmitter } from "../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargePoisonBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("ice", freezeEmitter)
  }
}
