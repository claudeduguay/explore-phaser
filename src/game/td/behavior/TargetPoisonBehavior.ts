import { Scene, GameObjects } from "phaser"
import IBehavior from "./IBehavior"
import { cloudEmitter } from "../emitter/ParticleConfig"
import ITowerModel from "../model/ITowerModel"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  model: ITowerModel
  targets: IHasPosition[]
}

export default class TargePoisonBehavior implements IBehavior<IHasTargets> {

  cloud?: GameObjects.Particles.ParticleEmitter

  update(obj: IHasTargets, time: number, delta: number) {
    if (!this.cloud) {
      console.log("Add poison emitter")
      this.cloud = obj.scene.add.particles(obj.x, obj.y, 'smoke', cloudEmitter(obj.model.stats.range / 2))
      this.cloud.stop()
    }
    if (obj.targets.length) {
      this.cloud?.start()
    } else { // No target
      this.cloud?.stop()
    }
  }
}
