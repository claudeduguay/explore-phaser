import { GameObjects, Math as PMath } from "phaser"
import BaseTargetBehavior from "../BaseTargetBehavior"
import { IEmitterConfigBuilder } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import Point from "../../../../../util/Point"

export default class BaseTargetSprayBehavior extends BaseTargetBehavior<GameObjects.Particles.ParticleEmitter> {

  constructor(public key: string, public emitter: IEmitterConfigBuilder) {
    super(false)
  }

  addEmitter(i: number, { x, y }: Point, tower: TDTower, time: number): void {
    if (this.emitters.length < i + 1) {
      const emitter = tower.scene.add.particles(x, y, this.key, this.emitter(tower.model.stats.range, tower))
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
