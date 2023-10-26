import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import TimedEffect from "./TimedEffect";

export default class TimedDamageEffect extends TimedEffect {

  constructor(public readonly tower: TDTower, enemy: TDEnemy, timeout: number, public name: string) {
    super(enemy, timeout)
  }

  updateEffect(time: number, delta: number): void {
    if (this.enemy.isFollowing()) {
      this.enemy.pauseFollow()
    }
  }

  endEffect(time: number, delta: number): void {
    if (!this.enemy.isFollowing()) {
      this.enemy.resumeFollow()
    }
  }

}
