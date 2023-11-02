import TDEnemy from "../../entity/enemy/TDEnemy"
import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../core/IBehavior"

export default abstract class TimedEffect implements IBehavior {

  startTime?: number

  constructor(public readonly tower: TDTower, public readonly enemy: TDEnemy, public readonly timeout: number,
    public name: string = tower.model.damage.health.type) {
  }

  update(time: number, delta: number): void {
    if (!this.startTime) {
      this.startTime = time
    }
    if (time - this.startTime >= this.timeout) {
      this.endEffect(time, delta)
      this.enemy.effects.delete(this)
      this.startTime = undefined
    } else {
      this.updateEffect(time, delta)
    }
  }

  abstract updateEffect(time: number, delta: number): void
  abstract endEffect(time: number, delta: number): void
}
