import IBehavior from "./IBehavior"

// Behavior array that dispatches behaviors to all it's children

export default class BehaviorList extends Array<IBehavior> implements IBehavior {

  update(time: number, delta: number) {
    const list = [...this] // We clone to avoid problems with any mutations
    list.forEach(behavior => behavior.update(time, delta))
  }

  push(...behavior: IBehavior[]): number {
    throw new Error("Should use add instead")
  }

  add(...behaviors: IBehavior[]): number {
    return super.push(...behaviors)
  }

  remove(behavior: IBehavior) {
    const index = this.indexOf(behavior)
    if (index > -1) {
      this.splice(index, 1)
    }
  }
}
