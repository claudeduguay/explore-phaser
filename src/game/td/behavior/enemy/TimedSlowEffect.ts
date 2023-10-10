import TimedEffect from "./TimedEffect";

export default class TimedSlowEffect extends TimedEffect {

  updateEffect(time: number, delta: number): void {
    if (this.enemy.frameCount % 2 > 0) {
      if (this.enemy.isFollowing()) {
        this.enemy.pauseFollow()
      }
    } else if (!this.enemy.isFollowing()) {
      this.enemy.resumeFollow()
    }
  }

  endEffect(time: number, delta: number): void {
    if (!this.enemy.isFollowing()) {
      this.enemy.resumeFollow()
    }
  }

}
