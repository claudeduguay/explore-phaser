import { IPropertyEffect } from "../../entity/model/EffectsProxy";
import BaseEffect from "./BaseEffect";

export default class ModifierEffect extends BaseEffect {

  effect?: IPropertyEffect  // Cache, so we remove the same instance

  startEffect(time: number, delta: number): void {
    if (this.tower.model.damage.health.type === "modifier") {
      const { name, prop, formula } = this.tower.model.damage.health
      this.effect = { name, prop, formula }
      this.enemy.model.general.addEffect(this.effect)
    }
  }

  endEffect(time: number, delta: number): void {
    if (this.tower.model.damage.health.type === "modifier" && this.effect) {
      this.enemy.model.general.deleteEffect(this.effect)
      this.effect = undefined
    }
  }
}
