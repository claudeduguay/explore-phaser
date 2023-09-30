import IBehavior from "./IBehavior"

// Behavior array that dispatches behaviors to all it's children

export default class BehaviorList<T> extends Array<IBehavior<T>> implements IBehavior<T> {

  update(obj: T, time: number, delta: number) {
    this.forEach(behavior => behavior.update(obj, time, delta))
  }
}
