import { Math as PMath } from "phaser"
import TDEnemy from "../../enemy/TDEnemy"
import TDTower from "../TDTower"
import IBehavior from "../../../behavior/core/IBehavior"
import { computeHealthDamage, computeShieldDamage } from "../../../behavior/tower/ComputeDamage"
import AffectsMap from "./AffectsMap"
import { ITowerAffectTime } from "../../model/ITowerModel"


/* 
Generalized Effect-handler Base (abstract) class.
Lifecycle is based on the existence of absence of duration, cooldown values
If cooldown is missing, assigned the same value as duration so, in thsi case, 
both endEffect and endCooldown are called in sequence in the same frame.
* startEffect is immediate and triggered only once
* endEffect triggers when we are either outside the timeout or range
* endCooldown triggers after cooldown time has elapsed or when out of range, right before self-destruct
* updateEffect triggers on each frame between startEffect and endEfffect
*/
export default class ApplyAffect implements IBehavior {

  isStarted?: boolean
  startTime?: number

  timing: ITowerAffectTime
  name!: string

  constructor(
    public readonly tower: TDTower,
    public readonly enemy: TDEnemy,
    public readonly affectsMap?: AffectsMap) {
    this.timing = tower.model.damage.timing || {}
    if (!this.timing.delay) {
      this.timing.delay = 0
    }
    if (!this.timing.duration) {
      this.timing.duration = 0
    }
    if (!this.timing.cooldown) {
      this.timing.cooldown = this.timing.duration
    }
    this.name = tower.model.damage.affect.name
  }

  isInRange() {
    const distance = PMath.Distance.BetweenPoints(this.enemy, this.tower)
    return distance <= this.tower.model.general.range
  }

  isTimeout(time: number, timeout: number) {
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
    const { delay, duration, cooldown } = this.timing
    if (delay && !this.isTimeout(time, delay)) {
      return
    }
    if (this.isTimeout(time, delay! + cooldown!)) {
      if (duration === cooldown) {
        this.endEffect(time, delta)
      }
      this.endCooldown(time, delta)
    } else {
      // Not started yet? Run startEffect, if in delay, won't get this far
      if (!this.isStarted) {
        this.startEffect(time, delta)
        this.isStarted = true
      } else {
        if (this.isTimeout(time, delay! + duration!)) {
          this.endEffect(time, delta)
        } else {
          this.updateEffect(time, delta)
        }
      }
    }
  }

  // Start if property effect
  startEffect(time: number, delta: number): void {
    if (this.tower.model.damage.affect.type === "prop") {
      this.enemy.model.general.addEffect(this.tower.model.damage.affect)
    }
  }

  // End if property effect
  endEffect(time: number, delta: number): void {
    if (this.tower.model.damage.affect.type === "prop") {
      this.enemy.model.general.deleteEffect(this.tower.model.damage.affect)
    }
  }

  // Update if health or sheild effect
  updateEffect(time: number, delta: number): void {
    if (this.tower.model.damage.affect.type === "health") {
      this.enemy.health -= computeHealthDamage(this.tower, this.enemy, delta)
    }
    if (this.tower.model.damage.affect.type === "shield") {
      this.enemy.shield -= computeShieldDamage(this.tower, this.enemy, delta)
    }
  }

  endCooldown(time: number, delta: number): void {
    this.affectsMap?.delete(this.enemy)
    this.enemy.effects.delete(this)
    this.startTime = undefined
  }
}
