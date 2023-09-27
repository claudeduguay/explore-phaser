
// Active value system. Uses a base value, such as the max health or default damage.
// Supports a set of modifiers that are applied when compute is called.
// This allows temporary effects to be added and removed

// Note that a modifier should be unique to avoid duplication for a given source
// For example, an effect causing damage should not recreate the function on each
// frame since they could be added each frame.

export type IModifyFunction = (value: number) => number

export default class ActiveValue extends Set<IModifyFunction> {

  constructor(public baseValue: number) {
    super()
  }

  compute() {
    let value = this.baseValue
    for (let modify of this) {
      value = modify(value)
    }
    return value
  }
}
