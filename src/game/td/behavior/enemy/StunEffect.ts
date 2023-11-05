import BaseEffect from "./BaseEffect";

export default class StunEffect extends BaseEffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.rewind(delta)
  }

}
