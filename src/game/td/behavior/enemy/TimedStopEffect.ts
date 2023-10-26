import TDEnemy from "../../entity/enemy/TDEnemy";
import TDTower from "../../entity/tower/TDTower";
import TimedEffect from "./TimedEffect";

export default class TimedDamageEffect extends TimedEffect {

  constructor(public readonly tower: TDTower, enemy: TDEnemy, public effectTimeout: number, timeout: number, public name: string) {
    super(enemy, timeout)
  }

  updateEffect(time: number, delta: number): void {
    if (this.startTime && time - this.startTime < this.effectTimeout) {
      if (this.enemy.isFollowing()) {
        this.enemy.pauseFollow()
      }
    } else {
      if (!this.enemy.isFollowing()) {
        this.enemy.resumeFollow()
      }
    }
  }

  endEffect(time: number, delta: number): void {
    if (!this.enemy.isFollowing()) {
      this.enemy.resumeFollow()
    }
  }

}
