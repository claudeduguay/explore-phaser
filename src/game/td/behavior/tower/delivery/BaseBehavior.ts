import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import { pickFirst } from "../../../entity/tower/Targeting"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import InRangeDamageEffect from "../../enemy/DamageEffect"
import { GameObjects, Math as PMath, Scene } from "phaser"

export type IEmitter = GameObjects.GameObject | GameObjects.Particles.ParticleEmitter

export interface IBaseEffectOptions {
  destroyEachFrame: boolean
  singleEmitter: boolean
  singleTarget: boolean
}

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseBehavior extends GameObjects.Container {

  targetInstanceMap = new TargetEffectsMap()

  constructor(scene: Scene,
    public tower: TDTower,
    public options: IBaseEffectOptions = {
      destroyEachFrame: true,
      singleEmitter: false,
      singleTarget: true
    }) {
    super(scene)
    this.addToUpdateList()
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

  preUpdate(time: number, delta: number) {
    this.maybeRotate()
    if (this.options.destroyEachFrame) {
      this.removeAll()
    }
    // If singleEmitter, the tower is the the only emissionPoint, else collect weapon points
    const emissionPoints = this.options.singleEmitter ? [this.tower] : this.tower.emissionPoints(false)
    if (!this.list.length) {
      emissionPoints.forEach((point, i) => this.initEmitter(i, point, time))
    }
    // Has a target
    if (this.tower.targeting.current.length) {
      emissionPoints.forEach((point, i) => this.updateEmitter(i, point, time))
      if (this.options.singleTarget) {
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
      emissionPoints.forEach((point, i) => this.clearEmitter(i, point, time))
      this.targetInstanceMap.clear()
      this.removeOrStopEmitters()
    }
    this.clearTargeting()
  }

  initEmitter(index: number, emissionPoint: IPointLike, time: number): void {

  }

  abstract updateEmitter(index: number, emissionPoint: IPointLike, time: number): void

  clearEmitter(index: number, emissionPoint: IPointLike, time: number): void {

  }

  removeOrStopEmitters(): void {
    if (this.list.length) {
      for (let emitter of this.list) {
        if (this.options.destroyEachFrame) {
          emitter.destroy()
        } else if ("stop" in emitter) {
          (emitter as GameObjects.Particles.ParticleEmitter).stop()
        }
      }
    }
    if (this.options.destroyEachFrame) {
      this.removeAll()
    }

  }
}
