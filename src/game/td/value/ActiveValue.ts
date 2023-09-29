
// Active value system. Uses a base value, such as the max health or default damage.
// Supports a set of modifiers that are applied when compute is called.
// This allows temporary effects to be added and removed

import { Events } from "phaser"

// Note that a modifier should be unique to avoid duplication for a given source
// For example, an effect causing damage should not recreate the function on each
// frame since they could be added each frame.

export type IModifyFunction = (value: number) => number

export default class ActiveValue extends Events.EventEmitter {

  modifiers = new Set<IModifyFunction>()

  constructor(public baseValue: number, public activeValue: number = baseValue) {
    super()
  }

  emitChanged() {
    this.emit("changed", this.compute())
  }

  addModifier(modifier: IModifyFunction) {
    if (!this.modifiers.has(modifier)) {
      this.modifiers.add(modifier)
      this.emitChanged()
    }
  }

  removeModifier(modifier: IModifyFunction) {
    if (this.modifiers.has(modifier)) {
      this.modifiers.delete(modifier)
      this.emitChanged()
    }
  }

  clearModifiers() {
    if (this.modifiers.size > 0) {
      this.modifiers.clear()
      this.emitChanged()
    }
  }

  resetToBase() {
    if (this.activeValue !== this.baseValue) {
      this.activeValue = this.baseValue
      this.emitChanged()
    }
  }

  adjust(modifier: IModifyFunction) {
    const adjusted = modifier(this.activeValue)
    if (adjusted !== this.activeValue) {
      this.activeValue = adjusted
      this.emitChanged()
    }
  }

  compute() {
    let value = this.activeValue
    for (let modify of this.modifiers) {
      value = modify(value)
    }
    return value
  }
}
