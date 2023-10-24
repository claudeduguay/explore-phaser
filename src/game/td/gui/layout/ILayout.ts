import { GameObjects, Display } from "phaser";
import { IBox, box } from "../../../../util/geom/Box";
import Point, { IPointLike } from "../../../../util/geom/Point";
type GetBounds = GameObjects.Components.GetBounds
type Size = GameObjects.Components.Size

export interface ILayout {
  apply(container: GameObjects.Container): void
}
export default ILayout

export function hasSize(child: GameObjects.GameObject): child is GameObjects.GameObject & Size {
  return child && "setSize" in child
}

export function hasBackground(child: GameObjects.GameObject): child is GameObjects.GameObject & { background: GameObjects.GameObject } & GetBounds & Size {
  return hasBounds(child) && "background" in child && "setSize" in child
}

export function hasBounds(child: GameObjects.GameObject): child is GameObjects.GameObject & GetBounds {
  return "getBounds" in child
}

export abstract class AbstractLayout implements ILayout {
  constructor(public gap: IPointLike = new Point(), public margin: IBox = box(10)) { }

  makeFilterBackground(container: GameObjects.Container) {
    return (child: GameObjects.GameObject, index: number, array: GameObjects.GameObject[]) => {
      if (hasBackground(container)) {
        return child !== container.background
      }
      return true
    }
  }

  resizeBackground(container: GameObjects.Container, max: { w: number, h: number }) {
    if (hasBackground(container)) {
      const b = container.getBounds()
      if (hasSize(container.background)) {
        container.background.setSize(max.w, max.h)
      }
    }
  }

  abstract apply(container: GameObjects.Container): void
}

export class HBoxLayout extends AbstractLayout implements ILayout {

  constructor(gap: IPointLike = new Point(), public margin: IBox = box(10),
    public align: "top" | "middle" | "bottom" = "top") {
    super(gap, margin)
  }

  apply(container: GameObjects.Container) {
    let offset = this.margin.x1
    const max = { w: 0, h: 0 }
    container.list
      .filter(this.makeFilterBackground(container))
      .forEach((child, i) => {
        if (hasBounds(child)) {
          const bounds = child.getBounds()
          if (bounds.height > max.h) {
            max.h = bounds.height
          }
          Display.Bounds.SetLeft(child, offset)
          switch (this.align) {
            case "middle":
              Display.Bounds.SetCenterY(child, this.margin.y1)
              break
            case "bottom":
              Display.Bounds.SetBottom(child, this.margin.y1)
              break
            default:
              Display.Bounds.SetTop(child, this.margin.y1)
          }
          offset += child.getBounds().width + this.gap.x
        }
      })
    max.w = offset
    this.resizeBackground(container, max)
  }
}

export class VBoxLayout extends AbstractLayout implements ILayout {

  constructor(gap: IPointLike = new Point(), public margin: IBox = box(10),
    public align: "left" | "center" | "right" = "left") {
    super(gap, margin)
  }

  apply(container: GameObjects.Container) {
    let offset = this.margin.y1
    const max = { w: 0, h: 0 }
    container.list
      .filter(this.makeFilterBackground(container))
      .forEach((child, i) => {
        if (hasBounds(child)) {
          const bounds = child.getBounds()
          if (bounds.width > max.w) {
            max.w = bounds.width
          }
          switch (this.align) {
            case "center":
              Display.Bounds.SetCenterX(child, this.margin.y1)
              break
            case "right":
              Display.Bounds.SetRight(child, this.margin.y1)
              break
            default:
              Display.Bounds.SetLeft(child, this.margin.x1)
          }
          Display.Bounds.SetTop(child, offset)
          offset += child.getBounds().height + this.gap.y
        }
      })
    max.h = offset
    this.resizeBackground(container, max)
  }
}
