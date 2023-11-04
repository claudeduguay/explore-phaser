import { Math as PMath } from "phaser"
import TDEnemy from "../../entity/enemy/TDEnemy"
import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../core/IBehavior"

export default abstract class InRangeEffect implements IBehavior {
  mark?: number

  constructor(public tower: TDTower, public enemy: TDEnemy,
    public name: string = tower.model.damage.health.name) {
  }

  update(time: number, delta: number): void {
    const distance = PMath.Distance.BetweenPoints(this.enemy, this.tower)
    const inRange = distance <= this.tower.model.general.range
    if (inRange) {
      this.updateEffect(time, delta)
    } else {
      this.endEffect(time, delta)
      this.enemy.effects.delete(this)
    }
  }

  abstract updateEffect(time: number, delta: number): void
  abstract endEffect(time: number, delta: number): void
}
