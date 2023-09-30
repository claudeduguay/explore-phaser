import { GameObjects, Math as PMath } from "phaser"
import { fireEmitter } from "../emitter/ParticleConfig"
import BaseTargetBehavior, { ITarget, ITower } from "./BaseTargetBehavior"

export default class TargetFireBehavior extends BaseTargetBehavior<GameObjects.Particles.ParticleEmitter> {

  constructor() {
    super(false)
  }

  addEmitter(i: number, { x, y }: ITarget, tower: ITower, time: number): void {
    if (this.emitters.length < i + 1) {
      const emitter = tower.scene.add.particles(x, y, 'fire', fireEmitter(tower.model.stats.range))
      emitter.stop()
      this.emitters.push(emitter)
    }
    if (tower.targets.length) {
      const target = tower.targets[0]
      this.emitters[i].setPosition(x, y)
      this.emitters[i].rotation = PMath.Angle.BetweenPoints(target, tower) - Math.PI
      this.emitters[i].start()
    }
  }
}
