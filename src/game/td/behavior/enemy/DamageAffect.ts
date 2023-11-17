import { computeHealthDamage } from "../tower/ComputeDamage";
import BaseAffect from "./BaseAffect";

export default class DamageAffect extends BaseAffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.health -= computeHealthDamage(this.tower, this.enemy, delta)
  }

}
