import { GameObjects } from "phaser";
import { IBounds, ILayoutTarget } from "./TreeLayout";

export default class PhaserLayoutTarget extends Map<string, GameObjects.Components.GetBounds & GameObjects.Components.Visible & GameObjects.Components.Transform & GameObjects.Components.Origin> implements ILayoutTarget {
  constructor(public w: number = 0, public h: number = 0) {
    super()
  }

  isVisible(node: string): boolean {
    const obj = this.get(node)
    if (obj) {
      return obj.visible
    }
    return false
  }

  getBounds(node: string): IBounds {
    const obj = this.get(node)
    if (obj) {
      const { x, y } = obj
      const { w, h } = this
      return { x: x - w * obj.originX, y: y - h * obj.originY, w, h }
    }
    return { x: 0, y: 0, w: 0, h: 0 }
  }

  setBounds(node: string, { x, y }: IBounds): void {
    const obj = this.get(node)
    if (obj) {
      obj.x = x
      obj.y = y
    }
  }

}
