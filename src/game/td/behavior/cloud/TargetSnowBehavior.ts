import Point from "../../../../util/Point"
import { snowEmitter } from "../../emitter/ParticleConfig"
import BaseTargeCloudBehavior from "./BaseTargetCloudBehavior"

export default class TargeSnowBehavior extends BaseTargeCloudBehavior {
  constructor() {
    super("snow", snowEmitter, new Point(0, -32))
  }
}
