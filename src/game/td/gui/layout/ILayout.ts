import { GameObjects } from "phaser";
import { IBox, box } from "../../../../util/geom/Box";
import Point, { IPointLike } from "../../../../util/geom/Point";
import Rectangle from "../../../../util/Rectangle";
import { Icon } from "../Icon";
import { Label } from "../Label";
type Size = GameObjects.Components.Size
type Transform = GameObjects.Components.Transform
type GetBounds = GameObjects.Components.GetBounds

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
    let offset = this.margin.x1
    container.list.forEach((child, i) => {
      if (hasBounds(child)) {
        if (child instanceof Icon || child instanceof Label) {
          child.setPosition(offset - child.width / 2, this.margin.y1)
          offset += child.width
        } else {
          child.setPosition(offset, this.margin.y1)
        }
        offset += child.width + this.gap.x
      }
    })
  }
}

export class VBoxLayout extends AbstractLayout implements ILayout {
  apply(container: GameObjects.Container) {
    let offset = this.margin.y1
    const cBounds = container.getBounds()
    container.list.forEach((child, i) => {
      if (hasBounds(child)) {
        if (child instanceof Icon || child instanceof Label) {
          child.setOrigin(0)
          // child.setPosition(this.margin.x1 - child.width / 2, offset - child.height)
          console.log("Target:", this.margin.x1, offset - child.height)
          child.setPosition(this.margin.x1 - cBounds.width / 2, offset - child.height)
          console.log("Position:", child.x, child.y)

        } else {
          child.setPosition(this.margin.x1, offset)
        }
        offset += child.height + this.gap.y
      }
    })
  }
}
