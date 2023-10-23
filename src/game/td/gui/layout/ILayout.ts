import { GameObjects, Display } from "phaser";
import { IBox, box } from "../../../../util/geom/Box";
import Point, { IPointLike } from "../../../../util/geom/Point";
import Rectangle from "../../../../util/Rectangle";
import { Icon } from "../Icon";
import { Label } from "../Label";
type Size = GameObjects.Components.Size
type Transform = GameObjects.Components.Transform
type GetBounds = GameObjects.Components.GetBounds
// type Origin = GameObjects.Components.Origin

export interface ILayout {
  apply(container: GameObjects.Container): void
}
export default ILayout

export function hasSize(child: GameObjects.GameObject): child is GameObjects.GameObject & Size {
  return "width" in child && "height" in child && "setSize" in child
}

export function hasPosition(child: GameObjects.GameObject): child is GameObjects.GameObject & Transform {
  return "x" in child && "y" in child && "setPosition" in child
}

export function hasOrigin(child: GameObjects.GameObject): child is GameObjects.GameObject & Transform {
  return "setOrigin" in child
}

export function hasBounds(child: GameObjects.GameObject): child is GameObjects.GameObject & Size & Transform & GetBounds {
  return "getBounds" in child && hasPosition(child) && hasSize(child)
}

export function getBounds(child: GameObjects.GameObject & Size & Transform) {
  return new Rectangle(child.x, child.y, child.width, child.height)
}

export abstract class AbstractLayout implements ILayout {
  constructor(public gap: IPointLike = new Point(), public margin: IBox = box(10)) { }
  abstract apply(container: GameObjects.Container): void
}

export class HBoxLayout extends AbstractLayout implements ILayout {
  apply(container: GameObjects.Container) {
    // const containerBounds = container.getBounds()
    let offset = this.margin.x1
    container.list.forEach((child, i) => {
      if (hasBounds(child)) {
        Display.Bounds.SetLeft(child, offset)
        Display.Bounds.SetTop(child, this.margin.y1)
        offset += child.getBounds().width + this.gap.x
      }
    })
  }
}

export class VBoxLayout extends AbstractLayout implements ILayout {
  apply(container: GameObjects.Container) {
    // const containerBounds = container.getBounds()
    let offset = this.margin.y1
    console.log("Margin/Gap:", this.margin, this.gap)
    container.list.forEach((child, i) => {
      if (hasBounds(child)) {
        Display.Bounds.SetLeft(child, this.margin.x1)
        Display.Bounds.SetTop(child, offset)
        offset += child.getBounds().height + this.gap.y
      }
    })
  }
}
