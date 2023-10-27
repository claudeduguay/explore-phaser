import { GameObjects, Display } from "phaser";
import { IBox, box } from "../../../../util/geom/Box";
import Point, { IPointLike } from "../../../../util/geom/Point";
type GetBounds = GameObjects.Components.GetBounds
type Size = GameObjects.Components.Size

export interface IMax {
  w: number,
  h: number
}

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

export function hasBounds(child: GameObjects.GameObject): child is GameObjects.GameObject & GetBounds & Size {
  return "getBounds" in child && hasSize(child)
}

export interface ISize {
  w: number,
  h: number
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

  computeMaximum(children: GameObjects.GameObject[]): IMax {
    const max = { w: 0, h: 0 }
    for (let child of children) {
      if (hasBounds(child)) {
        const bounds = child.getBounds()
        if (bounds.width > max.w) {
          max.w = bounds.width
        }
        if (bounds.height > max.h) {
          max.h = bounds.height
        }
      }
    }
    return max
  }

  resizeBackground(container: GameObjects.Container, max: { w: number, h: number }) {
    if (hasBackground(container)) {
      const b = container.getBounds()
      console.log("Bounds:", b, ", Max:", max)
      if (hasSize(container.background)) {
        container.background.setSize(max.w, max.h)
      }
    }
  }

  apply(container: GameObjects.Container): void {
    const children = container.list.filter(this.makeFilterBackground(container))
    const max = this.doLayout(container, children)
    this.resizeBackground(container, max)
  }

  abstract doLayout(container: GameObjects.Container, children: GameObjects.GameObject[]): ISize
}

export enum VAlign {
  Top = "top",
  Middle = "middle",
  Bottom = "bottom"
}

export enum HAlign {
  Left = "left",
  Center = "center",
  Right = "right"
}

export class HBoxLayout extends AbstractLayout implements ILayout {

  constructor(gap: IPointLike = new Point(), public margin: IBox = box(10),
    public align: VAlign = VAlign.Middle) {
    super(gap, margin)
  }

  doLayout(container: GameObjects.Container, children: GameObjects.GameObject[]): ISize {
    let offset = this.margin.x1
    const max = this.computeMaximum(children)
    children.forEach((child, i) => {
      if (hasBounds(child)) {
        Display.Bounds.SetLeft(child, offset)
        switch (this.align) {
          case VAlign.Middle:
            Display.Bounds.SetCenterY(child, this.margin.y1 + max.h / 2)
            break
          case VAlign.Bottom:
            Display.Bounds.SetBottom(child, this.margin.y1 + max.h)
            break
          default:
            Display.Bounds.SetTop(child, this.margin.y1)
        }
        offset += child.width + this.gap.x
      }
    })
    // Max is repurposed to reflect container target size
    max.h += (this.margin.y1 + this.margin.y2)
    max.w = offset + this.margin.x2
    return max
  }
}


export class VBoxLayout extends AbstractLayout implements ILayout {

  constructor(gap: IPointLike = new Point(), public margin: IBox = box(10),
    public align: HAlign = HAlign.Left) {
    super(gap, margin)
  }

  doLayout(container: GameObjects.Container, children: GameObjects.GameObject[]): ISize {
    let offset = this.margin.y1
    const max = this.computeMaximum(children)
    children.forEach((child, i) => {
      if (hasBounds(child)) {
        switch (this.align) {
          case HAlign.Center:
            Display.Bounds.SetCenterX(child, this.margin.y1 + max.w / 2)
            break
          case HAlign.Right:
            Display.Bounds.SetRight(child, this.margin.y1 + max.w)
            break
          default:
            Display.Bounds.SetLeft(child, this.margin.x1)
        }
        Display.Bounds.SetTop(child, offset)
        if (i === children.length - 1) {
          console.log("Last child height:", child.height)
        }
        offset += child.height + this.gap.y
      }
    })
    // Max is repurposed to reflect container target size
    max.w += (this.margin.x1 + this.margin.x2)
    max.h = offset + this.margin.y2
    return max
  }
}
