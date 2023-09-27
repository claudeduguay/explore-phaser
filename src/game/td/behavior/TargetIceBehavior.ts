import { Scene, GameObjects, Math as PMath } from "phaser"
import IBehavior from "./IBehavior"
import { iceEmitter } from "../emitter/ParticleConfig"
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
      this.cloud = obj.scene.add.particles(obj.x, obj.y, 'ice', iceEmitter(obj.model.stats.range / 2))
      this.cloud.stop()
    }
    if (obj.targets.length) {
      const target = obj.targets[0]
      this.cloud.setPosition(obj.x, obj.y)
      this.cloud.rotation = PMath.Angle.BetweenPoints(target, obj) - Math.PI
      this.cloud?.start()
    } else { // No target
      this.cloud?.stop()
    }
  }
}
