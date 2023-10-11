import { CSSProperties } from "react"
import ObservableValue from "../value/ObservableValue"
import { IBounds, ILayoutTarget, INodeKey } from "./TreeLayout"

export default class HTMLLayoutTarget extends Map<INodeKey, ObservableValue<CSSProperties>> implements ILayoutTarget {

  isVisible(key: INodeKey): boolean {
    return true
  }

  getBounds(key: INodeKey): IBounds {
    const observable = this.get(key)
    if (observable) {
      return {
        x: observable.value.left as number,
        y: observable.value.top as number,
        w: observable.value.width as number,
        h: observable.value.height as number
      }
    }
    return { x: 0, y: 0, w: 0, h: 0 }
  }

  setBounds(key: INodeKey, bounds: IBounds): void {
    const observable = this.get(key)
    if (observable) {
      observable.value = {
        position: "absolute",
        left: bounds.x,
        top: bounds.y,
        width: bounds.w,
        height: bounds.h
      }
    }
  }
}
