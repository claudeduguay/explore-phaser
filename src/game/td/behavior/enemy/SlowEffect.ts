import BaseEffect from "./BaseEffect";

export default class SlowEffect extends BaseEffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.rewind(delta / 2)
  }

}
