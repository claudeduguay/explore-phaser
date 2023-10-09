import { shockEmitter } from "../../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeShockBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("spark", shockEmitter)
  }
}
