import { GameObjects, Types, Math as PMath } from "phaser"
import BaseTargetBehavior, { ITarget, ITower } from "../BaseTargetBehavior"
import { IPointLike } from "../../../../util/Point"

export type IEmitterConfigurator = (range: number, pos?: IPointLike) => Types.GameObjects.Particles.ParticleEmitterConfig

export default class BaseTargetSprayBehavior extends BaseTargetBehavior<GameObjects.Particles.ParticleEmitter> {

  constructor(public key: string, public emitter: IEmitterConfigurator) {
    super(false)
  }

  addEmitter(i: number, { x, y }: ITarget, tower: ITower, time: number): void {
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
