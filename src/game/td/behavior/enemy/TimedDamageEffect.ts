import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import { computeTargetDamage } from "../tower/BaseTargetBehavior";
import TimedEffect from "./TimedEffect";

export default class TimedDamageEffect extends TimedEffect {

  constructor(enemy: TDEnemy, timeout: number, public name: string, public readonly tower: TDTower) {
    super(enemy, timeout)
  }

  updateEffect(time: number, delta: number): void {
    let damage = computeTargetDamage(this.tower, this.enemy, delta)
    this.enemy.health.adjust(-damage)
  }

  endEffect(time: number, delta: number): void {
  }

}
