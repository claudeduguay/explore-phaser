import { computeHealthDamage } from "../tower/ComputeDamage";
import BaseEffect from "./BaseEffect";

export default class DamageEffect extends BaseEffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.health -= computeHealthDamage(this.tower, this.enemy, delta)
  }

}
