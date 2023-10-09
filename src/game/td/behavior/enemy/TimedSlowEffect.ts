import TDEnemy from "../../entity/enemy/TDEnemy";
import TimedEffect from "./TimedEffect";

export default class TimeSlowEffect extends TimedEffect {

  updateEffect(enemy: TDEnemy, time: number, delta: number): void {
    if (enemy.frameCount % 2 > 0) {
      if (enemy.isFollowing()) {
        enemy.pauseFollow()
      }
    } else if (!enemy.isFollowing()) {
      enemy.resumeFollow()
    }
  }

  endEffect(enemy: TDEnemy, time: number, delta: number): void {
    if (!enemy.isFollowing()) {
      enemy.resumeFollow()
    }
  }

}
