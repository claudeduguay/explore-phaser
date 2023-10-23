import { GameObjects, Display } from "phaser";
import { IBox, box } from "../../../../util/geom/Box";
import Point, { IPointLike } from "../../../../util/geom/Point";
type GetBounds = GameObjects.Components.GetBounds

export interface ILayout {
  apply(container: GameObjects.Container): void
}
export default ILayout

export function hasBounds(child: GameObjects.GameObject): child is GameObjects.GameObject & GetBounds {
  return "getBounds" in child
}

export abstract class AbstractLayout implements ILayout {
  constructor(public gap: IPointLike = new Point(), public margin: IBox = box(10)) { }
  abstract apply(container: GameObjects.Container): void
}

export class HBoxLayout extends AbstractLayout implements ILayout {
  constructor(gap: IPointLike = new Point(), public margin: IBox = box(10),
    public align: "top" | "center" | "bottom" = "top") {
    super(gap, margin)
  }

  apply(container: GameObjects.Container) {
    let offset = this.margin.x1
    container.list.forEach((child, i) => {
      if (hasBounds(child)) {
        Display.Bounds.SetLeft(child, offset)
        switch (this.align) {
          case "center":
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
  }
}

export class VBoxLayout extends AbstractLayout implements ILayout {
  constructor(gap: IPointLike = new Point(), public margin: IBox = box(10),
    public align: "left" | "center" | "right" = "left") {
    super(gap, margin)
  }

  apply(container: GameObjects.Container) {
    let offset = this.margin.y1
    console.log("Margin/Gap:", this.margin, this.gap)
    container.list.forEach((child, i) => {
      if (hasBounds(child)) {
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
  }
}
