import { Scene } from "phaser"
import IBehavior from "./IBehavior"
import ITowerModel, { ITowerDamage } from "../model/ITowerModel"
import ActiveValue from "../value/ActiveValue"

export interface ITarget {
  x: number
  y: number
  health: ActiveValue
}

export interface ITower {
  x: number
  y: number
  scene: Scene
  model: ITowerModel
  emissionPoints: () => ITarget[]
  turret: { angle: number, rotation: number }
  targets: ITarget[]
}

export interface IEmitter {
  destroy: () => void
  stop?: () => void
}

export function applyDamage(tower: ITower, singleTarget: boolean = true) {
  let damage = 0
  Object.entries(tower.model.damage).forEach(([type, value]) => {
    damage += value
    console.log(`${value} ${type} damage from ${tower.model.name}`)
  })
  tower.targets.forEach(target => target.health.adjust(-damage))
}

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseTargetBehavior<T extends IEmitter> implements IBehavior<ITower> {

  emitters: T[] = []

  constructor(public destroyEachFrame: boolean = true, public singleTarget: boolean = true) {
  }

  update(tower: ITower, time: number, delta: number) {
    if (this.destroyEachFrame && this.emitters?.length) {
      for (let emitter of this.emitters) {
        emitter.destroy()
      }
      this.emitters = []
    }
    if (tower.targets.length > 0) {
      tower.emissionPoints().forEach((point, i) => this.addEmitter(i, point, tower, time))
      applyDamage(tower, this.singleTarget)
    } else {
      this.removeOrStopEmitters()
    }
  }

  abstract addEmitter(index: number, emissionPoint: ITarget, obj: ITower, time: number): void

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
