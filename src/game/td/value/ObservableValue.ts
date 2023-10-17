import { Events } from "phaser"
import { useEffect, useState } from "react"
import IModifyFunction from "./IModifyFunction"

// Observable value system. Sends changed ebent when value is updated

// Builders for common modifier functions
export const increment: IModifyFunction<number> = (value: number, x: number) => x + value
export const decrement: IModifyFunction<number> = (value: number, x: number) => x - value
export const multiply: IModifyFunction<number> = (value: number, x: number) => x * value
export const divide: IModifyFunction<number> = (value: number, x: number) => x / value

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
    if (this.activeValue !== value) {
      this.activeValue = value
      this.emitChanged()
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
