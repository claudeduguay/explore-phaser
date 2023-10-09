import IBehavior from "../IBehavior"
import TDEnemy from "../../entity/enemy/TDEnemy"
import TDTower from "../../entity/tower/TDTower"
import Point from "../../../../util/Point"

export interface IEmitter {
  destroy: () => void
  stop?: () => void
}

export function applyDamage(tower: TDTower, delta: number, singleTarget: boolean = true) {
  // console.log("Delta:", delta)
  let damage = 0
  const targets = singleTarget ? [tower.targets[0]] : tower.targets
  targets.forEach(target => {
    if (target instanceof TDEnemy) {  // Ensure acces by type
      Object.entries(tower.model.damage).forEach(([key, value]) => {
        const dps = (value * delta / 1000 * tower.scene.time.timeScale)
        const vulnerability = (target.model?.vulnerability[key] || target.model?.vulnerability.default)
        damage += (dps * vulnerability)
        // console.log(`${value}, (per update: ${dps}) ${key} damage from ${tower.model.name} (resistance: ${resistance})`)
      })
      target.health.adjust(-damage)
    }
  })
}

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseTargetBehavior<T extends IEmitter> implements IBehavior<TDTower> {

  emitters: T[] = []

  constructor(public destroyEachFrame: boolean = true, public singleTarget: boolean = true) {
  }

  update(tower: TDTower, time: number, delta: number) {
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

  abstract addEmitter(index: number, emissionPoint: Point, obj: TDTower, time: number): void

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
