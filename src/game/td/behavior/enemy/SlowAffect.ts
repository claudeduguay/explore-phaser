import BaseAffect from "./BaseAffect";

export default class SlowAffect extends BaseAffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.rewind(delta * 0.5)
  }
}
