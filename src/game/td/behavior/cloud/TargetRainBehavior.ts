import Point from "../../../../util/Point"
import { rainEmitter } from "../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeRainBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("rain", rainEmitter, new Point(0, -32))
  }
}
