import IBehavior from "./IBehavior"

// Behavior array that dispatches behaviors to all it's children

export default class BehaviorList extends Set<IBehavior> implements IBehavior {

  update(time: number, delta: number) {
    const list = [...this] // We clone to avoid problems with any mutations
    list.forEach(behavior => behavior.update(time, delta))
  }
}
