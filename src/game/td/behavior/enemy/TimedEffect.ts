import TDEnemy from "../../entity/enemy/TDEnemy"
import BehaviorList from "../core/BehaviorList"
import IBehavior from "../core/IBehavior"

export default abstract class TimedEffect implements IBehavior<TDEnemy> {

  mark?: number

  constructor(public readonly timeout: number) {
  }

  update(enemy: TDEnemy, time: number, delta: number, list: BehaviorList<TDEnemy>): void {
    if (!this.mark) {
      this.mark = time + this.timeout
      console.log(`Mark time out at: ${this.mark}`)
    }
    if (time >= this.mark) {
      console.log(`Effect timed out after: ${this.timeout}ms`)
      this.endEffect(enemy, time, delta)
      list.remove(this)
      this.mark = undefined
    } else {
      this.updateEffect(enemy, time, delta)
    }
  }

  abstract updateEffect(enemy: TDEnemy, time: number, delta: number): void
  abstract endEffect(enemy: TDEnemy, time: number, delta: number): void
}
