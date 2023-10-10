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
  root: INode
  edges: Map<INode, INode[]>
}

export interface INode {
  visible?: boolean
  position: Point
  size: Point
}

export interface IDrawSurface {
  drawLine(source: Point, target: Point): void
  drawPoly(points: Point[]): void
}

export interface ILayoutTarget {
  setNodePosition(node: INode, x: number, y: number, w: number, h: number): void
}

export class DefaultLayoutTarget {
  setNodePosition(node: INode, x: number, y: number, w: number, h: number): void {
    node.position.x = x
    node.position.y = y
    node.size.x = w
    node.size.y = h
  }
}

export default class TreeLayout {

  constructor(public tree: ITree, public readonly drawSurface: IDrawSurface,
    public layoutTarget: ILayoutTarget = new DefaultLayoutTarget()) {
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
  size: Point = new Point()


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

  children(node: INode) {
    return this.tree.edges.get(node) || []
  }

  isLeaf(node: INode) {
    return this.children(node).length === 0
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

  computeSize(node: INode): Point {
    if (!node.visible) {
      return new Point()
    }

    const node_size = node.size
    if (this.isLeaf(node)) {
      return node_size
    }

    if (this.isHorizontal()) {
      const accumulator = new Point()
      for (let child of this.children(node)) {
        if (child.visible) {
          const child_size = this.computeSize(child)
          accumulator.y += child_size.y + this.gap.y
          accumulator.x = Math.max(accumulator.x, child_size.x)
          return new Point(
            node_size.x + accumulator.x + this.gap.x,
            Math.max(node_size.y, accumulator.y - this.gap.y)
          )
        }
      }
    }

    if (this.isVertical()) {
      const accumulator = new Point()
      for (let child of this.children(node)) {
        if (child.visible) {
          const child_size = this.computeSize(child)
          accumulator.x += child_size.x + this.gap.x
          accumulator.y = Math.max(accumulator.y, child_size.y)
          return new Point(
            Math.max(node_size.x, accumulator.x - this.gap.x),
            node_size.y + accumulator.y + this.gap.y
          )
        }
      }
    }

    return new Point()
  }


  // -------------------------------------------------------------------
  // EXECUTE LAYOUT
  // -------------------------------------------------------------------

  layoutTree(node: INode) {
    switch (this.direction) {
      case TreeDirection.WEST:
        this.layout(node, this.size.x, 0)
        break
      case TreeDirection.NORTH:
        this.layout(node, 0, this.size.y)
        break
      case TreeDirection.EAST:
        this.layout(node, 0, 0)
        break
      case TreeDirection.SOUTH:
        this.layout(node, 0, 0)
        break
    }
  }

  layout(node: INode, x: number, y: number) {
    if (!node.visible) {
      return
    }
    const computed_size = this.computeSize(node)
    if (this.isHorizontal()) {
      let aligned_y = y
      if (this.isCenter()) {
        aligned_y += (computed_size.y - node.size.y) / 2
      }
      if (this.isEnd()) {
        aligned_y += computed_size.y - node.size.y
      }
      if (this.isEast()) {
        this.layoutTarget.setNodePosition(node, x, aligned_y, node.size.x, node.size.y)
        x += node.size.x + this.gap.x
      }
      else {
        this.layoutTarget.setNodePosition(node, x - node.size.x, aligned_y, node.size.x, node.size.y)
        x -= node.size.x + this.gap.x
      }

      for (let child of this.children(node)) {
        if (child.visible) {
          this.layout(child, x, y)
          y += this.computeSize(child).y + this.gap.y
        }
      }
      if (this.isVertical()) {
        var aligned_x = x
        if (this.isCenter()) {
          aligned_x += (computed_size.x - node.size.x) / 2
        }
        if (this.isEnd()) {
          aligned_x += computed_size.x - node.size.x
        }
        if (this.isSouth()) {
          this.layoutTarget.setNodePosition(node, aligned_x, y, node.size.x, node.size.y)
          y += node.size.y + this.gap.y
        }
        else {
          this.layoutTarget.setNodePosition(node, aligned_x, y - node.size.y, node.size.x, node.size.y)
          y -= node.size.y + this.gap.y
        }
        for (let child of this.children(node)) {
          if (child.visible) {
            this.layout(child, x, y)
            x += this.computeSize(child).x + this.gap.x
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

  drawLines(node: INode) {
    if (!node.visible) {
      return
    }

    if (this.isHorizontal()) {
      const source = new Point()

      if (this.isEast()) {
        source.x = node.position.x + node.size.x
      }
      else {
        source.x = node.position.x
        source.y = node.position.y + node.size.y / 2
      }

      for (let child of this.children(node)) {
        if (child.visible) {
          const target = new Point()

          target.y = child.position.y + child.size.y / 2
          if (this.isEast()) {
            target.x = child.position.x
          }
          else {
            target.x = child.position.x + child.size.x
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
        source.x = node.position.x + node.size.x / 2
        if (this.isSouth()) {
          source.y = node.position.y + node.size.y
        }
        else {
          source.y = node.position.y
          //		print("Vertical source: %s, mid: %s, target: %s" % [str(source), str(mid), str(target)])
        }

        for (let child of this.children(node)) {
          if (child.visible) {
            const target = new Point()
            target.x = child.position.x + child.size.x / 2
            if (this.isSouth()) {
              target.y = child.position.y
            }
            else {
              target.y = child.position.y + child.size.y
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
