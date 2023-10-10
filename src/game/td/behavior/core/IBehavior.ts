interface IBehavior<T> {
  update(obj: T, time: number, delta: number): void
}

export default IBehavior
