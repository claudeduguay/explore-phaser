import BehaviorList from "./BehaviorList"

interface IBehavior<T> {
  update(obj: T, time: number, delta: number, list: BehaviorList<T>): void
}

export default IBehavior
