import TDEnemy from "../../entity/enemy/TDEnemy"
import IBehavior from "../core/IBehavior"

export default abstract class TimedEffect implements IBehavior {

  maxTime?: number

  constructor(public enemy: TDEnemy, public readonly timeout: number) {
  }

  update(time: number, delta: number): void {
    if (!this.maxTime) {
      this.maxTime = time + this.timeout
    }
    if (time >= this.maxTime) {
      this.endEffect(time, delta)
      this.enemy.effects.delete(this)
      this.maxTime = undefined
    } else {
      this.updateEffect(time, delta)
    }
  }

  abstract updateEffect(time: number, delta: number): void
  abstract endEffect(time: number, delta: number): void
}
