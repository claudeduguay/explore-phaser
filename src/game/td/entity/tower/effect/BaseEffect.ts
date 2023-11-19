import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import { ISingleTargetStrategy, pickFirst, pickAll, IMultiTargetStrategy } from "../../../entity/tower/Targeting"
import { GameObjects, Math as PMath } from "phaser"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import AffectsMap from "../affect/AffectsMap"
import ApplyAffect from "../affect/ApplyAffect"

export interface IBaseEffectOptions {
  singleEmitter: boolean
  singleTarget: boolean
}

export function affectFactory(tower: TDTower, target: TDEnemy, affectsMap: AffectsMap) {
  return new ApplyAffect(tower, target, affectsMap)
}

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseEffect extends GameObjects.Container {

  targetInstanceMap = new AffectsMap()
  twinInstanceMap = new AffectsMap() // Needed for speed effects to match in preview

  constructor(public tower: TDTower,
    public options: IBaseEffectOptions = {
      singleEmitter: false,
      singleTarget: true
    },
    public singlePickStrategy: ISingleTargetStrategy = pickFirst,
    public multiPickStrategy: IMultiTargetStrategy = pickAll) {
    super(tower.scene)
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

      const targets = this.options.singleTarget ?
        [this.singlePickStrategy(this.tower)!] :
        this.multiPickStrategy(this.tower)

      // Apply enemy Affects
      targets.forEach((target: TDEnemy) => {
        this.targetInstanceMap.apply(target, () => affectFactory(this.tower, target, this.targetInstanceMap))
        if (target.twin) { // Handle twin if present to reflect speed affects in preview
          this.twinInstanceMap.apply(target.twin, () => affectFactory(this.tower, target.twin!, this.twinInstanceMap))
        }
      })
    } else {
      // No targets
      emissionPoints.forEach((point, i) => this.clearEmitter(i, point, time))
      this.targetInstanceMap.clear()
      this.stopAllParticleEmitters()
    }
    this.clearTargeting()
  }

  initEmitter(index: number, emissionPoint: IPointLike, time: number): void { }

  abstract updateEmitter(index: number, emissionPoint: IPointLike, time: number): void

  clearEmitter(index: number, emissionPoint: IPointLike, time: number): void { }

  stopAllParticleEmitters(): void {
    for (let emitter of this.list) {
      if (emitter instanceof GameObjects.Particles.ParticleEmitter) {
        emitter.stop()
      }
    }
  }

  remove(child: GameObjects.GameObject | GameObjects.GameObject[], destroyChild?: boolean): this {
    console.log("Remove called (destroy):", destroyChild, child)
    if (!Array.isArray(child)) {
      if (child instanceof GameObjects.Particles.ParticleEmitter) {
        child.killAll()
        child.destroy()
        destroyChild = false
      }
    }
    return super.remove(child, destroyChild)
  }

  // preDestroy() {
  //   console.log("preDestroy called")
  //   this.stopAllParticleEmitters()
  //   super.preDestroy()
  // }
}
