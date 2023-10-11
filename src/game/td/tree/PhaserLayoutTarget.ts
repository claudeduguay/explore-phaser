import { GameObjects } from "phaser";
import { IBounds, ILayoutTarget } from "./TreeLayout";

export default class PhaserLayoutTarget extends Map<string, GameObjects.Components.GetBounds & GameObjects.Components.Visible & GameObjects.Components.Transform> implements ILayoutTarget {

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
      const { x, y, width, height } = obj.getBounds()
      return { x, y, w: width, h: height }
    }
    return { x: 0, y: 0, w: 0, h: 0 }
  }
  setBounds(node: string, bounds: IBounds): void {
    const obj = this.get(node)
    if (obj) {
      obj.setPosition(bounds.x, bounds.y)
    }
  }

}
