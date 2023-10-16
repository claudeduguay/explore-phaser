import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import { computeTargetDamage } from "../tower/ComputeDamage";
import InRangeEffect from "./InRangeEffect";

export default class InRangeDamageEffect extends InRangeEffect {

  constructor(tower: TDTower, enemy: TDEnemy, public name: string) {
    super(tower, enemy)
  }

  updateEffect(time: number, delta: number): void {
    let damage = computeTargetDamage(this.tower, this.enemy, delta)
    this.enemy.health.value -= damage
  }

  endEffect(time: number, delta: number): void {
  }

}
