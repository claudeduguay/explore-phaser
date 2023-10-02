import { Events } from "phaser"
import { useEffect, useState } from "react"
import { clamp } from "../../../util/MathUtil"
import IModifyFunction from "./IModifyFunction"

// Active value system. Uses a base value, such as the max health or default damage.
// Supports a set of modifiers that are applied when compute is called.
// This allows temporary effects to be added and removed

// Note that a modifier should be unique to avoid duplication for a given source
// For example, an effect causing damage should not recreate the function on each
// frame since they could be added each frame.

// Builders for common modifier functions
export const increment = (value: number): IModifyFunction<number> => (x: number) => x + value
export const decrement = (value: number): IModifyFunction<number> => (x: number) => x - value
export const multiply = (value: number): IModifyFunction<number> => (x: number) => x * value
export const divide = (value: number): IModifyFunction<number> => (x: number) => x / value

export default class ActiveValue extends Events.EventEmitter {

  modifiers = new Set<IModifyFunction<number>>()

  constructor(public baseValue: number, public min: number = 0, public max: number = 100, public activeValue: number = baseValue) {
    super()
  }

  emitChanged() {
    this.emit("changed", this.compute())
  }

  addModifier(modifier: IModifyFunction<number>) {
    if (!this.modifiers.has(modifier)) {
      this.modifiers.add(modifier)
      this.emitChanged()
    }
  }

  removeModifier(modifier: IModifyFunction<number>) {
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

  adjust(modifier: IModifyFunction<number> | number) {
    if (typeof modifier === "number") {
      modifier = increment(modifier)
    }
    const adjusted = modifier(this.activeValue)
    if (adjusted !== this.activeValue) {
      this.activeValue = adjusted
      this.emitChanged()
    }
  }

  reset() {
    if (this.activeValue !== this.baseValue) {
      this.activeValue = this.baseValue
      this.emitChanged()
    }
  }

  compute() {
    let value = this.activeValue
    for (let modify of this.modifiers) {
      value = modify(value)
    }
    return clamp(value, this.min, this.max)
  }
}


export type IActiveValueListener = (value: number) => void

// React active value monitoring hook
export function useActiveValue(activeValue: ActiveValue): number {
  const [current, setCurrent] = useState<number>(activeValue.compute())
  useEffect(() => {
    const listener: IActiveValueListener = (value: number) => setCurrent(value)
    activeValue.addListener("changed", listener)
    return () => {
      activeValue.removeListener("changed", listener)
    }
  }, [activeValue])
  return current
}
