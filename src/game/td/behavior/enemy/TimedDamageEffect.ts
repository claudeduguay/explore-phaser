import { computeTargetDamage } from "../tower/ComputeDamage";
import TimedEffect from "./TimedEffect";

export default class TimedDamageEffect extends TimedEffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.health -= computeTargetDamage(this.tower, this.enemy, delta)
  }

  endEffect(time: number, delta: number): void {
  }

}
