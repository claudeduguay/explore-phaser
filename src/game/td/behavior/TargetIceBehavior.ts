import { GameObjects, Math as PMath } from "phaser"
import { iceEmitter } from "../emitter/ParticleConfig"
import BaseTargetBehavior, { IHasPosition, IHasTargets } from "./BaseTargetBehavior"

export default class TargetIceBehavior extends BaseTargetBehavior<GameObjects.Particles.ParticleEmitter> {

  constructor() {
    super(false)
  }

  addEmitter(i: number, { x, y }: IHasPosition, obj: IHasTargets, time: number): void {
    if (this.emitters.length < i + 1) {
      console.log("Add fire emitter:", i)
      const emitter = obj.scene.add.particles(x, y, 'ice', iceEmitter(obj.model.stats.range))
      emitter.stop()
      this.emitters.push(emitter)
    }
    if (obj.targets.length) {
      const target = obj.targets[0]
      this.emitters[i].setPosition(x, y)
      this.emitters[i].rotation = PMath.Angle.BetweenPoints(target, obj) - Math.PI
      this.emitters[i]?.start()
    }
  }
}
