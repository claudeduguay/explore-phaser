import TDEnemy from "../../entity/enemy/TDEnemy"
import IBehavior from "../core/IBehavior"

export default abstract class TimedEffect implements IBehavior {

  mark?: number

  constructor(public enemy: TDEnemy, public readonly timeout: number) {
  }

  update(time: number, delta: number): void {
    if (!this.mark) {
      this.mark = time + this.timeout
    }
    if (time >= this.mark) {
      // console.log(`Effect timed out after: ${this.timeout}ms`)
      this.endEffect(time, delta)
      this.enemy.effects.remove(this)
      this.mark = undefined
    } else {
      this.updateEffect(time, delta)
    }
  }

  abstract updateEffect(time: number, delta: number): void
  abstract endEffect(time: number, delta: number): void
}
