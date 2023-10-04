import { Scene } from "phaser"
import IBehavior from "./IBehavior"
import ITowerModel from "../model/ITowerModel"
import ActiveValue from "../value/ActiveValue"
import TDEnemy from "../enemy/TDEnemy"

export interface ITarget {
  x: number
  y: number
  health: ActiveValue
}

export interface ITower {
  preview: boolean
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

export function applyDamage(tower: ITower, delta: number, singleTarget: boolean = true) {
  // console.log("Delta:", delta)
  let damage = 0
  const targets = singleTarget ? [tower.targets[0]] : tower.targets
  targets.forEach(target => {
    if (target instanceof TDEnemy) {  // Ensure acces by type
      Object.entries(tower.model.damage).forEach(([key, value]) => {
        const dps = (value * delta / 1000 * tower.scene.time.timeScale)
        const resistance = (target.model?.resistance[key] || target.model?.resistance.default)
        const multiplier = 1.0 - resistance
        damage += (dps * multiplier)
        // console.log(`${value}, (per update: ${dps}) ${key} damage from ${tower.model.name} (resistance: ${resistance})`)
      })
      target.health.adjust(-damage)
    }
  })
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
      applyDamage(tower, delta, this.singleTarget)
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
