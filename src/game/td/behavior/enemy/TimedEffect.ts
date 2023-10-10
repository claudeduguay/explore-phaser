import TDEnemy from "../../entity/enemy/TDEnemy"
import IBehavior from "../core/IBehavior"

export default abstract class TimedEffect implements IBehavior<TDEnemy> {

  mark?: number

  constructor(public enemy: TDEnemy, public readonly timeout: number) {
  }

  update(enemy: TDEnemy, time: number, delta: number): void {
    if (!this.mark) {
      this.mark = time + this.timeout
    }
    if (time >= this.mark) {
      console.log(`Effect timed out after: ${this.timeout}ms`)
      this.endEffect(enemy, time, delta)
      enemy.effects.remove(this)
      this.mark = undefined
    } else {
      this.updateEffect(enemy, time, delta)
    }
  }

  abstract updateEffect(enemy: TDEnemy, time: number, delta: number): void
  abstract endEffect(enemy: TDEnemy, time: number, delta: number): void
}
