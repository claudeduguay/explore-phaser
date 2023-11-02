import { computeTargetDamage } from "../tower/ComputeDamage";
import InRangeEffect from "./InRangeEffect";

export default class InRangeDamageEffect extends InRangeEffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.health -= computeTargetDamage(this.tower, this.enemy, delta)
  }

  endEffect(time: number, delta: number): void {
  }

}
