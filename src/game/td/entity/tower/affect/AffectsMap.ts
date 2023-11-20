import TDEnemy from "../../enemy/TDEnemy";
import IBehavior from "../../../behavior/IBehavior";

export default class AffectsMap extends Map<TDEnemy, IBehavior> {

  // Caches effect for a given target, if not present, by calling effectBuilder
  // Adds the effect to the target from cache
  apply(target: TDEnemy, effectBuilder: () => IBehavior) {
    if (!this.has(target)) {
      this.set(target, effectBuilder())
    }
    const instance = this.get(target)
    if (instance) {
      target.effects.add(instance)
    }
  }
}
