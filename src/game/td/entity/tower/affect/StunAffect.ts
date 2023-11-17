import BaseAffect from "./BaseAffect";

export default class StunAffect extends BaseAffect {

  updateEffect(time: number, delta: number): void {
    this.enemy.rewind(delta)
  }

}
