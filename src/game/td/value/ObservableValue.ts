import { Events } from "phaser"
import { useEffect, useState } from "react"
import IModifyFunction from "./IModifyFunction"

// Observable value system. Sends changed ebent when value is updated

export const CHANGED_EVENT = "changed"

export default class ObservableValue<T> extends Events.EventEmitter {

  constructor(public activeValue: T) {
    super()
  }

  emitChanged() {
    this.emit(CHANGED_EVENT, this.activeValue)
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
      }
    } else {
      this.value = modifier
    }
  }

}


export type IObservableValueListener<T> = (value: T) => void

// React observable value monitoring hook
export function useObservableValue<T>(observable?: ObservableValue<T>): T | undefined {
  const [current, setCurrent] = useState<T | undefined>(observable?.value)
  useEffect(() => {
    const listener: IObservableValueListener<T> = (value: T) => setCurrent(value)
    if (observable) {
      observable.addListener(CHANGED_EVENT, listener)
      return () => {
        observable.removeListener(CHANGED_EVENT, listener)
      }
    }
  }, [observable])
  return current
}
