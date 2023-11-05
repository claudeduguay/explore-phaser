import { computeTargetDamage } from "../tower/ComputeDamage";
import BaseEffect from "./BaseEffect";

export default class DamageEffect extends BaseEffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.health -= computeTargetDamage(this.tower, this.enemy, delta)
  }

  endEffect(time: number, delta: number): void {
  }
}
