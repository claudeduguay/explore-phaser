import { Math as PMath } from "phaser"
import TDEnemy from "../../entity/enemy/TDEnemy"
import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../core/IBehavior"


/* 
Generalize Effect-handler Base (abstract) class.
Lifecycle is based on the existence of absence of duration, cooldown values
If cooldown is missing, assigned the same value as duration so, in thsi case, 
both endEffect and endCooldown are called in sequence in the same frame.
* startEffect is immediate and triggered only once
* endEffect triggers when we are either outside the timeout or range
* endCooldown triggers after cooldown time has elapsed or when out of range, right before self-destruct
* updateEffect triggers on each frame between startEffect and endEfffect
*/
export default abstract class BaseEffect implements IBehavior {

  isStarted?: boolean
  startTime?: number

  duration?: number
  cooldown?: number

  constructor(
    public readonly tower: TDTower,
    public readonly enemy: TDEnemy,
    public name: string = tower.model.damage.health.name) {
    const { duration, cooldown } = tower.model.damage.health
    this.duration = duration
    this.cooldown = cooldown || duration
  }

  isInRange() {
    const distance = PMath.Distance.BetweenPoints(this.enemy, this.tower)
    return distance <= this.tower.model.general.range
  }

  isTimeout(time: number, timeout?: number) {
    if (timeout && this.startTime) {
      const elapsed = time - this.startTime
      return elapsed >= timeout
    } else {
      return this.isInRange()
    }
  }

  update(time: number, delta: number): void {
    if (!this.startTime) {
      this.startTime = time
    }
    // Destroy effect if past the cooldowntime
    if (this.isTimeout(time, this.cooldown)) {
      if (this.duration === this.cooldown) {
        this.endEffect(time, delta)
      }
      this.endCooldown(time, delta)
      this.enemy.effects.delete(this)
      this.startTime = undefined
    } else {
      // Not started yet? Run startEffect
      if (!this.isStarted) {
        this.startEffect(time, delta)
        this.isStarted = true
      } else {
        if (this.isTimeout(time, this.duration)) {
          this.endEffect(time, delta)
        } else {
          this.updateEffect(time, delta)
        }
      }
    }
  }

  startEffect(time: number, delta: number): void {

  }

  updateEffect(time: number, delta: number): void {

  }

  endEffect(time: number, delta: number): void {

  }

  endCooldown(time: number, delta: number): void {

  }
}