import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import { computeTargetDamage } from "../tower/BaseTargetBehavior";
import TimedEffect from "./TimedEffect";

export default class TimedDamageEffect extends TimedEffect {

  constructor(enemy: TDEnemy, timeout: number, public name: string, public readonly tower: TDTower) {
    super(enemy, timeout)
  }

  updateEffect(target: TDEnemy, time: number, delta: number): void {
    let damage = computeTargetDamage(this.tower, target, delta)
    target.health.adjust(-damage)
  }

  endEffect(enemy: TDEnemy, time: number, delta: number): void {
  }

}
