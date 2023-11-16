import IBehavior from "../../core/IBehavior"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import { pickFirst } from "../../../entity/tower/Targeting"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import InRangeDamageEffect from "../../enemy/DamageEffect"
import { GameObjects, Math as PMath } from "phaser"

export type IEmitter = GameObjects.GameObject | GameObjects.Particles.ParticleEmitter

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseBehavior implements IBehavior {

  targetInstanceMap = new TargetEffectsMap()

  constructor(
    public tower: TDTower,
    public destroyEachFrame: boolean = true,
    public singleTarget: boolean = true) {
  }

  asRelative(pos: IPointLike) {
    return new Point(pos.x - this.tower.x, pos.y - this.tower.y)
  }

  maybeRotate() {
    if (this.tower.model.meta.rotation !== "target") {
      this.tower.turret.angle += this.tower.model.meta.rotation
    } else if (this.tower.targeting.current.length) {
      const target = pickFirst(this.tower.targeting.current)!
      this.tower.turret.rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI / 2
    }
  }

  clearTargeting() {
    if (this.tower.preview !== PreviewType.Preview) {
      this.tower.targeting.clear()
    }
  }

  update(time: number, delta: number) {
    this.maybeRotate()
    if (this.destroyEachFrame) {
      this.tower.effect.removeAll()
    }
    if (!this.tower.effect.list.length) {
      this.tower.emissionPoints(false).forEach((point, i) => this.initEmitter(i, point, time))
    }
    if (this.tower.targeting.current.length) {
      this.tower.emissionPoints(false).forEach((point, i) => this.updateEmitter(i, point, time))
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
      this.tower.emissionPoints(false).forEach((point, i) => this.clearEmitter(i, point, time))
      this.targetInstanceMap.clear()
      this.removeOrStopEmitters()
    }
    this.clearTargeting()
  }

  abstract initEmitter(index: number, emissionPoint: Point, time: number): void
  abstract updateEmitter(index: number, emissionPoint: Point, time: number): void
  abstract clearEmitter(index: number, emissionPoint: Point, time: number): void

  removeOrStopEmitters(): void {
    if (this.tower.effect.list.length) {
      for (let emitter of this.tower.effect.list) {
        if (this.destroyEachFrame) {
          emitter.destroy()
        } else if ("stop" in emitter) {
          (emitter as GameObjects.Particles.ParticleEmitter).stop()
        }
      }
    }
    if (this.destroyEachFrame) {
      this.tower.effect.removeAll()
    }

  }
}
