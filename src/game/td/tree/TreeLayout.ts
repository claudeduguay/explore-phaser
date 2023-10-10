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
  STRAIGHT = 1,
  SQUARE = 2,
  CURVE = 3
}

export interface ITree {
  root: IKey
  edges: Map<IKey, IKey[]>
}

export type IKey = string

export interface IDefaultNode {
  visible?: boolean
  position: Point
  size: Point
}

export interface IDrawSurface {
  drawLine(source: Point, target: Point): void
  drawPoly(points: Point[]): void
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
  isVisible(node: IKey): boolean | undefined
  getBounds(node: IKey): IBounds
  setBounds(node: IKey, bounds: IBounds): void
}

export default class TreeLayout {

  constructor(public tree: ITree, public readonly drawSurface: IDrawSurface,
    public layoutTarget: ILayoutTarget) {
  }

  // Adapted from my own work in Widget Factory Article: JComponentTree
  // see: http://www.claudeduguay.com/articles/tree/JComponentTreeArticle.html
  // Readapted: from Godot (GDSscript) port

  direction: TreeDirection = TreeDirection.EAST
  alignment: TreeAlignment = TreeAlignment.CENTER
  line_type: TreeLineType = TreeLineType.SQUARE
  line_color: number = 0xFF9900
  line_width: number = 1.0
  gap: Point = new Point(50, 15)

  // Note: We need to be affecting the container size, not this value
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
    return this.line_type === TreeLineType.CURVE
  }

  isSquare() {
    return this.line_type === TreeLineType.SQUARE
  }

  isStraight() {
    return this.line_type === TreeLineType.STRAIGHT
  }


  // -------------------------------------------------------------------
  // CHILDREN UTILITY
  // -------------------------------------------------------------------

  children(node: IKey) {
    return this.tree.edges.get(node) || []
  }

  isLeaf(node: IKey) {
    return this.children(node).length === 0
  }



  // -------------------------------------------------------------------
  // LAYOUT TARGET UTILITIES
  // -------------------------------------------------------------------

  isVisible(node: IKey): boolean | undefined {
    return this.layoutTarget.isVisible(node)
  }

  getBounds(node: IKey): IBounds {
    return this.layoutTarget.getBounds(node)
  }

  setBounds(node: IKey, x: number, y: number, w: number, h: number): void {
    this.layoutTarget.setBounds(node, { x, y, w, h })
  }


  // -------------------------------------------------------------------
  // MAIN CONTAINER TRIGGER
  // -------------------------------------------------------------------

  // _notification(what: any) {
  // 	if what == NOTIFICATION_SORT_CHILDREN {
  // 		full_layout()
  //   }
  // }

  fullLayout() {
    if (this.tree.root) {
      // const custom_minimum_size = this.compute_size(this.root)
      this.size = this.computeSize(this.tree.root)
      this.layoutTree(this.tree.root)
      // this.queue_redraw()
    }
  }


  // -------------------------------------------------------------------
  // COMPUTE NODE(AND CHILDREN) SIZE
  // -------------------------------------------------------------------

  computeSize(node: IKey): ISize {
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
          return {
            w: bounds.w + accumulator.x + this.gap.x,
            h: Math.max(bounds.h, accumulator.y - this.gap.y)
          }
        }
      }
    }

    if (this.isVertical()) {
      const accumulator = new Point()
      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          const childSize = this.computeSize(child)
          accumulator.x += childSize.w + this.gap.x
          accumulator.y = Math.max(accumulator.y, childSize.h)
          return {
            w: Math.max(bounds.w, accumulator.x - this.gap.x),
            h: bounds.h + accumulator.y + this.gap.y
          }
        }
      }
    }

    return { w: 0, h: 0 }
  }


  // -------------------------------------------------------------------
  // EXECUTE LAYOUT
  // -------------------------------------------------------------------

  layoutTree(node: IKey) {
    switch (this.direction) {
      case TreeDirection.WEST:
        this.layout(node, this.size.w, 0)
        break
      case TreeDirection.NORTH:
        this.layout(node, 0, this.size.h)
        break
      case TreeDirection.EAST:
        this.layout(node, 0, 0)
        break
      case TreeDirection.SOUTH:
        this.layout(node, 0, 0)
        break
    }
  }

  layout(node: IKey, x: number, y: number) {
    if (!this.isVisible(node)) {
      return
    }
    const computed_size = this.computeSize(node)
    const bounds = this.getBounds(node)
    if (this.isHorizontal()) {
      let aligned_y = y
      if (this.isCenter()) {
        aligned_y += (computed_size.h - bounds.h) / 2
      }
      if (this.isEnd()) {
        aligned_y += computed_size.h - bounds.h
      }
      if (this.isEast()) {
        this.layoutTarget.setBounds(node, { x, y: aligned_y, w: bounds.w, h: bounds.h })
        x += bounds.w + this.gap.x
      } else {
        this.layoutTarget.setBounds(node, { x: x - bounds.w, y: aligned_y, w: bounds.w, h: bounds.h })
        x -= bounds.w + this.gap.x
      }

      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          this.layout(child, x, y)
          y += this.computeSize(child).h + this.gap.y
        }
      }
      if (this.isVertical()) {
        var aligned_x = x
        if (this.isCenter()) {
          aligned_x += (computed_size.w - bounds.w) / 2
        }
        if (this.isEnd()) {
          aligned_x += computed_size.w - bounds.w
        }
        if (this.isSouth()) {
          this.layoutTarget.setBounds(node, { x: aligned_x, y, w: bounds.w, h: bounds.w })
          y += bounds.h + this.gap.y
        } else {
          this.layoutTarget.setBounds(node, { x: aligned_x, y: y - bounds.h, h: bounds.h, w: bounds.w })
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
  }


  // -------------------------------------------------------------------
  // DRAW CONNECTIONS
  // -------------------------------------------------------------------

  _draw() {
    //	draw_rect(Rect2(Vector2.ZERO, size), Color.DARK_SLATE_GRAY, false, 2)
    this.drawLines(this.tree.root)
  }

  drawCurve(source: Point, target: Point, point_count: number = 20) {
    // const mid = source.lerp(target, 0.5)
    // let control1 = new Point(mid.x, source.y)
    // let control2 = new Point(mid.x, target.y)
    // if (this.is_vertical()) {
    //   control1 = new Point(source.x, mid.y)
    //   control2 = new Point(target.x, mid.y)
    // }
    // const points = []
    // for (let i = 0; i < point_count + 1; i++) {
    //   let f = i / point_count
    //   points.push(source.bezier_interpolate(control1, control2, target, f))
    //   this.draw_surface.draw_poly(points)
    // }
  }

  drawSquare(source: Point, target: Point) {
    if (this.isHorizontal()) {
      var mid = new Point(lerp(source.x, target.x, 0.5), source.y)

      this.drawSurface.drawLine(source, mid)
      this.drawSurface.drawLine(new Point(mid.x, target.y), target)
      if (mid.y !== target.y) {
        this.drawSurface.drawLine(mid, new Point(mid.x, target.y))
      }
      else {
        const mid = new Point(source.x, lerp(source.y, target.y, 0.5))
        this.drawSurface.drawLine(source, mid)
        this.drawSurface.drawLine(new Point(target.x, mid.y), target)
        if (mid.x !== target.x) {
          this.drawSurface.drawLine(mid, new Point(target.x, mid.y))
        }
      }
    }
  }

  drawLines(node: IKey) {
    if (!this.isVisible(node)) {
      return
    }

    const bounds = this.getBounds(node)
    if (this.isHorizontal()) {
      const source = new Point()

      if (this.isEast()) {
        source.x = bounds.x + bounds.w
      }
      else {
        source.x = bounds.x
        source.y = bounds.y + bounds.h / 2
      }

      for (let child of this.children(node)) {
        if (this.isVisible(child)) {
          const target = new Point()
          const childBounds = this.getBounds(child)

          target.y = bounds.y + childBounds.h / 2
          if (this.isEast()) {
            target.x = childBounds.x
          }
          else {
            target.x = childBounds.x + childBounds.w
            var mid = new Point(lerp(source.x, target.x, 0.5), source.y)

            if (this.isCurve()) {
              this.drawCurve(source, target)
            }
            else if (this.isSquare()) {
              this.drawSquare(source, target)
            }
            else {
              this.drawSurface.drawLine(new Point(source.x, mid.y), target)
            }
            this.drawLines(child)
          }
        }
      }

      if (this.isVertical()) {
        const source = new Point()
        source.x = bounds.x + bounds.w / 2
        if (this.isSouth()) {
          source.y = bounds.y + bounds.h
        }
        else {
          source.y = bounds.y
          //		print("Vertical source: %s, mid: %s, target: %s" % [str(source), str(mid), str(target)])
        }

        for (let child of this.children(node)) {
          if (this.isVisible(child)) {
            const childBounds = this.getBounds(child)
            const target = new Point()
            target.x = childBounds.x + childBounds.w / 2
            if (this.isSouth()) {
              target.y = childBounds.y
            }
            else {
              target.y = childBounds.y + childBounds.h
            }

            if (this.isCurve()) {
              this.drawCurve(source, target)
            }
            else if (this.isSquare()) {
              this.drawSquare(source, target)
            }
            else {
              this.drawSurface.drawLine(source, target)
              this.drawLines(child)
            }
          }
        }
      }
    }
  }


  // -------------------------------------------------------------------
  // Collect flatened TreeContainerNode(s) from a Control node root
  // -------------------------------------------------------------------

  // // Alternative, which collects and disconnects nodes and produces an edges array
  // static from_tree(node: INode, nodes: Array<any> = [], edges: Map<any, any>) {
  //   TreeLayout.from_node(node, nodes, edges)
  //   return { "nodes": nodes, "edges": edges }
  // }

  // static from_node(node: INode, nodes: Array<INode> = [], edges: Map<any, any> = new Map<any, any>()) {
  //   nodes.push(node)
  //   edges.set(node, [])
  //   for (let child of this.children(node)) {
  //     edges.get(node).push(child)
  //     TreeLayout.from_node(child, nodes, edges)
  //   }
  // }

}
