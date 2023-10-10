import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import { computeTargetDamage } from "../tower/ComputeDamage";
import TimedEffect from "./TimedEffect";

export default class TimedDamageEffect extends TimedEffect {

  constructor(public readonly tower: TDTower, enemy: TDEnemy, timeout: number, public name: string) {
    super(enemy, timeout)
  }

  updateEffect(time: number, delta: number): void {
    let damage = computeTargetDamage(this.tower, this.enemy, delta)
    this.enemy.health.adjust(-damage)
  }

  endEffect(time: number, delta: number): void {
  }

}
