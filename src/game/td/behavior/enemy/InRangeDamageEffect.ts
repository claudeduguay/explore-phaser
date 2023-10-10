import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import { computeTargetDamage } from "../tower/ComputeDamage";
import InRangeEffect from "./InRangeEffect";

export default class InRangeDamageEffect extends InRangeEffect {

  constructor(enemy: TDEnemy, tower: TDTower, public name: string) {
    super(enemy, tower)
  }

  updateEffect(time: number, delta: number): void {
    let damage = computeTargetDamage(this.tower, this.enemy, delta)
    this.enemy.health.adjust(-damage)
  }

  endEffect(time: number, delta: number): void {
  }

}
