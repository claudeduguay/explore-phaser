import TDEnemy from "../../entity/enemy/TDEnemy";
import TimedEffect from "./TimedEffect";

export default class TimeSlowdEffect extends TimedEffect {

  frame?: number

  updateEffect(enemy: TDEnemy, time: number, delta: number): void {
    if (!this.frame) {
      this.frame = 1
    } else {
      this.frame += 1
    }
    console.log("Effect frame:", this.frame)
    if (this.frame % 2 === 0) {
      console.log("Pause follow:", this.frame)
      enemy.pauseFollow()
    } else {
      console.log("Resume follow:", this.frame)
      enemy.resumeFollow()
    }
  }

  endEffect(enemy: TDEnemy) {
    enemy.resumeFollow()
  }

}
