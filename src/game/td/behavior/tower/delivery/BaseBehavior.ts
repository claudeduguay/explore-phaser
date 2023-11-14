import IBehavior from "../../core/IBehavior"
import TDTower from "../../../entity/tower/TDTower"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import { pickFirst } from "../../../entity/tower/Targeting"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import InRangeDamageEffect from "../../enemy/DamageEffect"
import { GameObjects } from "phaser"

export type IEmitter = GameObjects.GameObject | GameObjects.Particles.ParticleEmitter

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseTargetBehavior<T extends IEmitter> implements IBehavior {

  emitters: T[] = []
  targetInstanceMap = new TargetEffectsMap()

  constructor(
    public tower: TDTower,
    public destroyEachFrame: boolean = true,
    public singleTarget: boolean = true) {
  }

  asRelative(pos: IPointLike) {
    return new Point(pos.x - this.tower.x, pos.y - this.tower.y)
  }

  update(time: number, delta: number) {
    if (this.destroyEachFrame && this.emitters?.length) {
      for (let emitter of this.emitters) {
        emitter.destroy()
      }
      this.emitters = []
      this.tower.effect.removeAll()
    }
    if (this.tower.targeting.current.length) {
      this.tower.emissionPoints(false).forEach((point, i) => this.addEmitter(i, point, time))
      if (this.singleTarget) {
        const target = pickFirst(this.tower.targeting.current)
        if (target) {
          this.targetInstanceMap.apply(target, () => (new InRangeDamageEffect(this.tower, target)))
        }
      } else {
        this.tower.targeting.current.forEach(target => {
          this.targetInstanceMap.apply(target, () => (new InRangeDamageEffect(this.tower, target)))
        })
      }
    } else {
      this.targetInstanceMap.clear()
      this.removeOrStopEmitters()
    }
  }

  abstract addEmitter(index: number, emissionPoint: Point, time: number): void

  removeOrStopEmitters(): void {
    if (this.emitters?.length) {
      for (let emitter of this.emitters) {
        if (this.destroyEachFrame) {
          emitter.destroy()
        } else if ("stop" in emitter) {
          emitter.stop()
        }
      }
      if (this.destroyEachFrame) {
        this.emitters = []
        this.tower.effect.removeAll()
      }
    }

  }
}
