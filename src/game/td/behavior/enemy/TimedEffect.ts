import TDEnemy from "../../entity/enemy/TDEnemy"
import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../core/IBehavior"

export default abstract class TimedEffect implements IBehavior {

  startTime?: number

  constructor(
    public readonly tower: TDTower,
    public readonly enemy: TDEnemy,
    public readonly timeout: number = tower.model.damage.health.duration || 0,
    public name: string = tower.model.damage.health.name) {
  }

  update(time: number, delta: number): void {
    if (!this.startTime) {
      this.startTime = time
    }
    const elapsed = Math.floor(time - (this.startTime || 0))
    if (elapsed >= this.timeout) {
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
