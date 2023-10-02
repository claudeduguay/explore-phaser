
// Active value system. Uses a base value, such as the max health or default damage.
// Supports a set of modifiers that are applied when compute is called.
// This allows temporary effects to be added and removed

import { Events } from "phaser"
import { useEffect, useState } from "react"
import IModifyFunction from "./IModifyFunction"

// Note that a modifier should be unique to avoid duplication for a given source
// For example, an effect causing damage should not recreate the function on each
// frame since they could be added each frame.

export default class ObservableValue<T> extends Events.EventEmitter {

  constructor(public activeValue: T) {
    super()
  }

  emitChanged() {
    this.emit("changed", this.activeValue)
  }

  get value() {
    return this.activeValue
  }

  set value(value: T) {
    this.activeValue = value
    this.emitChanged()
  }

  adjust(modifier: IModifyFunction<T> | T) {
    if (modifier instanceof Function) {
      const adjusted = modifier(this.activeValue)
      if (adjusted !== this.activeValue) {
        this.value = adjusted
        this.emitChanged()
      }
    } else {
      this.value = modifier
    }
  }

}


export type IObservableValueListener<T> = (value: T) => void

// React observable value monitoring hook
export function useObservableValue<T>(observableValue: ObservableValue<T>): T {
  const [current, setCurrent] = useState<T>(observableValue.value)
  useEffect(() => {
    const listener: IObservableValueListener<T> = (value: T) => setCurrent(value)
    observableValue.addListener("changed", listener)
    return () => {
      observableValue.removeListener("changed", listener)
    }
  }, [observableValue])
  return current
}
