import IBehavior from "../core/IBehavior"
import TDTower from "../../entity/tower/TDTower"
import Point from "../../../../util/geom/Point"
import { pickFirst } from "../../entity/tower/Targeting"
import TargetEffectsMap from "../../entity/tower/affect/AffectsMap"
import ApplyAffect from "../../entity/tower/affect/ApplyAffect"

export interface IEmitter {
  destroy: () => void
  stop?: () => void
}

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseTargetBehavior<T extends IEmitter> implements IBehavior {

  emitters: T[] = []
  targetInstanceMap = new TargetEffectsMap()

  constructor(public tower: TDTower, public destroyEachFrame: boolean = true, public singleTarget: boolean = true) {
  }

  update(time: number, delta: number) {
    if (this.destroyEachFrame && this.emitters?.length) {
      for (let emitter of this.emitters) {
        emitter.destroy()
      }
      this.emitters = []
    }
    if (this.tower.targeting.current.length) {
      this.tower.emissionPoints().forEach((point, i) => this.addEmitter(i, point, time))
      if (this.singleTarget) {
        const target = pickFirst(this.tower)
        if (target) {
          this.targetInstanceMap.apply(target, () => (new ApplyAffect(this.tower, target, this.targetInstanceMap)))
        }
      } else {
        this.tower.targeting.current.forEach(target => {
          this.targetInstanceMap.apply(target, () => (new ApplyAffect(this.tower, target, this.targetInstanceMap)))
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
        } else if (emitter.stop) {
          emitter.stop()
        }
      }
      if (this.destroyEachFrame) {
        this.emitters = []
      }
    }

  }
}
