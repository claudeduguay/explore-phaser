import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import { ISingleTargetStrategy, pickFirst, pickAll, IMultiTargetStrategy } from "../../../entity/tower/Targeting"
import DamageAffect from "../../../entity/tower/affect/DamageAffect"
import { GameObjects, Math as PMath, Scene } from "phaser"
import { isPropDamage } from "../../../entity/model/ITowerModel"
import PropAffect from "../../../entity/tower/affect/PropAffect"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import AffectsMap from "../affect/AffectsMap"

export type IEmitter = GameObjects.GameObject | GameObjects.Particles.ParticleEmitter

export interface IBaseEffectOptions {
  singleEmitter: boolean
  singleTarget: boolean
}

export function affectFactory(tower: TDTower, target: TDEnemy) {
  if (isPropDamage(tower.model.damage)) {
    return new PropAffect(tower, target, tower.model.damage.name)
  } else {
    return new DamageAffect(tower, target, tower.model.damage.name)
  }
}

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseEffect extends GameObjects.Container {

  targetInstanceMap = new AffectsMap()
  twinInstanceMap = new AffectsMap() // Needed for speed effects to match in preview

  constructor(scene: Scene,
    public tower: TDTower,
    public options: IBaseEffectOptions = {
      singleEmitter: false,
      singleTarget: true
    },
    public singlePickStrategy: ISingleTargetStrategy = pickFirst,
    public multiPickStrategy: IMultiTargetStrategy = pickAll) {
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
      const target = this.singlePickStrategy(this.tower)!
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
    // If singleEmitter, the tower is the the only emissionPoint, else collect weapon points
    const emissionPoints = this.options.singleEmitter ? [this.tower] : this.tower.emissionPoints(false)

    // Call init only if the effect is empty
    if (this.list.length === 0) {
      emissionPoints.forEach((point, i) => this.initEmitter(i, point, time))
    }

    // Has a target
    const current = this.tower.targeting.current
    if (current.length) {
      // Update individual emitters 
      emissionPoints.forEach((point, i) => this.updateEmitter(i, point, time))
      // Apply enemy Damage Effect
      const targets = this.options.singleTarget ?
        [this.singlePickStrategy(this.tower)!] :
        this.multiPickStrategy(this.tower)
      targets.forEach((target: TDEnemy) => {
        this.targetInstanceMap.apply(target, () => affectFactory(this.tower, target))
        if (target.twin) { // Handle twin if present to reflect speed affects in preview
          this.twinInstanceMap.apply(target.twin, () => affectFactory(this.tower, target.twin!))
        }
      })
    } else {
      emissionPoints.forEach((point, i) => this.clearEmitter(i, point, time))
      this.targetInstanceMap.clear()
      this.removeOrStopEmitters()
    }
    this.clearTargeting()
  }

  initEmitter(index: number, emissionPoint: IPointLike, time: number): void { }

  abstract updateEmitter(index: number, emissionPoint: IPointLike, time: number): void

  clearEmitter(index: number, emissionPoint: IPointLike, time: number): void { }

  removeOrStopEmitters(): void {
    for (let emitter of this.list) {
      if ("stop" in emitter) {
        (emitter as GameObjects.Particles.ParticleEmitter).stop()
      }
    }
  }
}
