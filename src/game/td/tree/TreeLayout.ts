import { lerp } from "../../../util/MathUtil"
import Point from "../../../util/Point"

export enum TreeDirection {
  NORTH = 1,
  SOUTH = 2,
  EAST = 3,
  WEST = 4
}

export enum TreeAlignment {
  START = 1,
  CENTER = 2,
  END = 3
}

export enum TreeLineType {
  LINE = 1,
  BLOCK = 2,
  CURVE = 3
}

export interface ITree {
  root: INodeKey
  edges: Map<INodeKey, INodeKey[]>
}

export type INodeKey = string

export interface IDefaultNode {
  visible?: boolean
  position: Point
  size: Point
}

export interface IDrawSurface {
  clear(): void
  drawLine(source: Point, target: Point, color: string, width: number): void
  drawPoly(points: Point[], color: string, width: number): void
}

export interface ISize {
  w: number
  h: number
}

export interface IBounds extends ISize {
  x: number
  y: number
}

export interface ILayoutTarget {
  isVisible(node: INodeKey): boolean
  getBounds(node: INodeKey): IBounds
  setBounds(node: INodeKey, bounds: IBounds): void
}

export default class TreeLayout {

  constructor(
    public readonly tree: ITree,
    public readonly drawSurface: IDrawSurface,
    public readonly layoutTarget: ILayoutTarget) {
  }

  // Adapted from my own work in Widget Factory Article: JComponentTree
  // see: http://www.claudeduguay.com/articles/tree/JComponentTreeArticle.html
  // Readapted: from Godot (GDSscript) port

  direction: TreeDirection = TreeDirection.EAST
  alignment: TreeAlignment = TreeAlignment.CENTER
  lineType: TreeLineType = TreeLineType.BLOCK
  lineColor: string = "#FFFFFF"
  lineWidth: number = 2.0
  gap: Point = new Point(50, 50)
  margin: Point = new Point(50, 50)

  // Note: We need to be affecting the container size, not necessarily this value
  size: ISize = { w: 0, h: 0 }


  // -------------------------------------------------------------------
  // Utility functions to shorten conditional checks
  // -------------------------------------------------------------------

  isHorizontal() {
    return this.direction === TreeDirection.EAST || this.direction === TreeDirection.WEST
  }

  isVertical() {
    return this.direction === TreeDirection.NORTH || this.direction === TreeDirection.SOUTH
  }

  isEast() {
    return this.direction === TreeDirection.EAST
  }

  isWest() {
    return this.direction === TreeDirection.WEST
  }

  isSouth() {
    return this.direction === TreeDirection.SOUTH
  }

  isNorth() {
    return this.direction === TreeDirection.NORTH
  }

  isStart() {
    return this.alignment === TreeAlignment.START
  }

  isCenter() {
    return this.alignment === TreeAlignment.CENTER
  }

  isEnd() {
    return this.alignment === TreeAlignment.END
  }

  isCurve() {
    return this.lineType === TreeLineType.CURVE
  }

  isSquare() {
    return this.lineType === TreeLineType.BLOCK
  }

  isStraight() {
    return this.lineType === TreeLineType.LINE
  }


  // -------------------------------------------------------------------
  // CHILDREN UTILITY
  // -------------------------------------------------------------------

  children(node: INodeKey) {
    return this.tree.edges.get(node) || []
  }

  isLeaf(node: INodeKey) {
    return this.children(node).length === 0
  }


  // -------------------------------------------------------------------
  // DRAW SURFACE UTILITIES
  // -------------------------------------------------------------------

  clear() {
    this.drawSurface.clear()
  }

  drawLine(source: Point, target: Point) {
    this.drawSurface.drawLine(source, target, this.lineColor, this.lineWidth)
  }

  drawPoly(points: Point[]) {
    this.drawSurface.drawPoly(points, this.lineColor, this.lineWidth)
  }


  // -------------------------------------------------------------------
  // LAYOUT TARGET UTILITIES
  // -------------------------------------------------------------------

  isVisible(node: INodeKey): boolean | undefined {
    return this.layoutTarget.isVisible(node)
  }

  getBounds(node: INodeKey): IBounds {
    return this.layoutTarget.getBounds(node)
  }

  setBounds(node: INodeKey, bounds: IBounds): void {
    this.layoutTarget.setBounds(node, bounds)
  }


  // -------------------------------------------------------------------
  // MAIN CONTAINER TRIGGER
  // -------------------------------------------------------------------

  doLayout() {
    if (this.tree.root) {
      this.size = this.computeSize(this.tree.root)
      this.layoutTree(this.tree.root)
      this.clear()
      this.drawLines(this.tree.root)
    }
  }


  // -------------------------------------------------------------------
  // COMPUTE NODE(AND CHILDREN) SIZE
  // -------------------------------------------------------------------

  computeSize(node: INodeKey): ISize {
    if (!this.isVisible(node)) {
      return { w: 0, h: 0 }
    }

    const bounds = this.getBounds(node)
    if (this.isLeaf(node)) {
      return { w: bounds.w, h: bounds.h }
    }

    if (this.isHorizontal()) {
      const accumulator = new Point()
      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          const childSize = this.computeSize(child)
          accumulator.y += childSize.h + this.gap.y
          accumulator.x = Math.max(accumulator.x, childSize.w)
        }
      }
      return {
        w: bounds.w + accumulator.x + this.gap.x,
        h: Math.max(bounds.h, accumulator.y - this.gap.y)
      }
    }

    if (this.isVertical()) {
      const accumulator = new Point()
      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          const childSize = this.computeSize(child)
          accumulator.x += childSize.w + this.gap.x
          accumulator.y = Math.max(accumulator.y, childSize.h)
        }
      }
      return {
        w: Math.max(bounds.w, accumulator.x - this.gap.x),
        h: bounds.h + accumulator.y + this.gap.y
      }
    }

    return { w: 0, h: 0 }
  }


  // -------------------------------------------------------------------
  // EXECUTE LAYOUT
  // -------------------------------------------------------------------

  layoutTree(node: INodeKey) {
    switch (this.direction) {
      case TreeDirection.WEST:
        this.layout(node, this.size.w + this.margin.x, this.margin.y)
        break
      case TreeDirection.NORTH:
        this.layout(node, this.margin.x, this.size.h + this.margin.y)
        break
      case TreeDirection.EAST:
        this.layout(node, this.margin.x, this.margin.y)
        break
      case TreeDirection.SOUTH:
        this.layout(node, this.margin.x, this.margin.y)
        break
    }
  }

  layout(node: INodeKey, x: number, y: number) {
    if (!this.isVisible(node)) {
      return
    }
    const computedSize = this.computeSize(node)
    const bounds = this.getBounds(node)
    if (this.isHorizontal()) {
      let yAligned = y
      if (this.isCenter()) {
        yAligned += (computedSize.h - bounds.h) / 2
      }
      if (this.isEnd()) {
        yAligned += computedSize.h - bounds.h
      }
      if (this.isEast()) {
        this.setBounds(node, { x, y: yAligned, w: bounds.w, h: bounds.h })
        x += bounds.w + this.gap.x
      } else {
        this.setBounds(node, { x: x - bounds.w, y: yAligned, w: bounds.w, h: bounds.h })
        x -= bounds.w + this.gap.x
      }
      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          this.layout(child, x, y)
          y += this.computeSize(child).h + this.gap.y
        }
      }
    }
    if (this.isVertical()) {
      var xAligned = x
      if (this.isCenter()) {
        xAligned += (computedSize.w - bounds.w) / 2
      }
      if (this.isEnd()) {
        xAligned += computedSize.w - bounds.w
      }
      if (this.isSouth()) {
        this.setBounds(node, { x: xAligned, y, w: bounds.w, h: bounds.h })
        y += bounds.h + this.gap.y
      } else {
        this.setBounds(node, { x: xAligned, y: y - bounds.h, w: bounds.w, h: bounds.h })
        y -= bounds.h + this.gap.y
      }
      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          this.layout(child, x, y)
          x += this.computeSize(child).w + this.gap.x
        }
      }
    }
  }


  // -------------------------------------------------------------------
  // DRAW CONNECTIONS
  // -------------------------------------------------------------------

  drawCurve(source: Point, target: Point, pointCount: number = 20) {
    let control1 = new Point(target.x, source.y)
    let control2 = new Point(source.x, target.y)
    if (this.isVertical()) {
      control1 = new Point(source.x, target.y)
      control2 = new Point(target.x, source.y)
    }
    const points = []
    for (let i = 0; i < pointCount + 1; i++) {
      let f = i / pointCount
      points.push(source.bezier(control1, control2, target, f))
      this.drawPoly(points)
    }
  }

  drawSquare(source: Point, target: Point) {
    if (this.isHorizontal()) {
      const mid = new Point(lerp(source.x, target.x, 0.5), source.y)
      this.drawLine(source, mid)
      this.drawLine(new Point(mid.x, target.y), target)
      if (mid.y !== target.y) {
        this.drawLine(mid, new Point(mid.x, target.y))
      }
    }
    if (this.isVertical()) {
      const mid = new Point(source.x, lerp(source.y, target.y, 0.5))
      this.drawLine(source, mid)
      this.drawLine(new Point(target.x, mid.y), target)
      if (mid.x !== target.x) {
        this.drawLine(mid, new Point(target.x, mid.y))
      }
    }
  }

  drawLines(node: INodeKey) {
    if (!this.isVisible(node)) {
      return
    }

    const bounds = this.getBounds(node)
    if (this.isHorizontal()) {
      const source = new Point()
      source.y = bounds.y + bounds.h / 2
      if (this.isEast()) {
        source.x = bounds.x + bounds.w
      } else {
        source.x = bounds.x
      }

      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          const target = new Point()
          const childBounds = this.getBounds(child)
          target.y = childBounds.y + childBounds.h / 2
          if (this.isEast()) {
            target.x = childBounds.x
          } else {
            target.x = childBounds.x + childBounds.w
          }
          console.log(source, target)
          if (this.isCurve()) {
            this.drawCurve(source, target)
          } else if (this.isSquare()) {
            this.drawSquare(source, target)
          } else {
            // const mid = new Point(lerp(source.x, target.x, 0.5), source.y)
            // this.drawLine(new Point(source.x, mid.y), target)
            this.drawLine(source, target)
          }
          this.drawLines(child)
        }
      }
    }

    if (this.isVertical()) {
      console.log("Vertical")
      const source = new Point()
      source.x = bounds.x + bounds.w / 2
      if (this.isSouth()) {
        source.y = bounds.y + bounds.h
      } else {
        source.y = bounds.y
      }

      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          const target = new Point()
          const childBounds = this.getBounds(child)
          target.x = childBounds.x + childBounds.w / 2
          if (this.isSouth()) {
            target.y = childBounds.y
          } else {
            target.y = childBounds.y + childBounds.h
          }
          console.log(source, target)
          if (this.isCurve()) {
            this.drawCurve(source, target)
          } else if (this.isSquare()) {
            this.drawSquare(source, target)
          } else {
            // const mid = new Point(source.x, lerp(source.y, target.y, 0.5))
            // this.drawLine(new Point(mid.x, source.y), target)
            this.drawLine(source, target)
          }
          this.drawLines(child)
        }
      }
    }
  }

}
