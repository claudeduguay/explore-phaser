import { GameObjects, Math as PMath } from "phaser"
import BaseTargetBehavior from "../BaseTargetBehavior"
import { IEmitterConfigBuilder } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import Point from "../../../../../util/Point"

export default class BaseTargetSprayBehavior extends BaseTargetBehavior<GameObjects.Particles.ParticleEmitter> {

  constructor(tower: TDTower, public key: string, public emitter: IEmitterConfigBuilder) {
    super(tower, false)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    if (this.emitters.length < i + 1) {
      const emitter = this.tower.scene.add.particles(x, y, this.key, this.emitter(this.tower.model.stats.range, this.tower))
      emitter.stop()
      this.emitters.push(emitter)
    }
    if (this.tower.targeting.current.length) {
      const target = this.tower.targeting.current[0]
      this.emitters[i].setPosition(x, y)
      this.emitters[i].rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI
      this.emitters[i].start()
    }
  }
}
