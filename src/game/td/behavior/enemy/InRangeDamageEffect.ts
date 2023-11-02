import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import { computeTargetDamage } from "../tower/ComputeDamage";
import InRangeEffect from "./InRangeEffect";

export default class InRangeDamageEffect extends InRangeEffect {

  constructor(tower: TDTower, enemy: TDEnemy, public name: string) {
    super(tower, enemy)
  }

  updateEffect(time: number, delta: number): void {
    this.enemy.health -= computeTargetDamage(this.tower, this.enemy, delta)
  }

  endEffect(time: number, delta: number): void {
  }

}
