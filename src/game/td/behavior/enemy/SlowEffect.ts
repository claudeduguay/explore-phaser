import BaseEffect from "./BaseEffect";

export default class SlowEffect extends BaseEffect {

  updateEffect(time: number, delta: number): void {
    console.log("Update slow")
    this.enemy.rewind(delta * 0.75)
  }
}
