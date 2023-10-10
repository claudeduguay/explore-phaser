import IBehavior from "./IBehavior"

// Behavior array that dispatches behaviors to all it's children

export default class BehaviorList<T> extends Array<IBehavior<T>> implements IBehavior<T> {

  update(obj: T, time: number, delta: number) {
    const list = [...this] // We clone to avoid problems with any mutations
    list.forEach(behavior => behavior.update(obj, time, delta))
  }

  remove(behavior: IBehavior<T>) {
    const index = this.indexOf(behavior)
    if (index > -1) {
      this.splice(index, 1)
    }
  }
}
