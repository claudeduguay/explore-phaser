import BITS_MAP from "../util/Cardinal"
import Point from "../util/Point"

export default class Cell {

  parent?: Cell
  pos!: Point
  connections = new Map<Point, Cell | null>()
  visited: boolean = false
  depth: number = 0

  constructor(x: number, y: number) {
    this.pos = new Point(x, y)
    this.connections.set(Point.NORTH, null)
    this.connections.set(Point.SOUTH, null)
    this.connections.set(Point.WEST, null)
    this.connections.set(Point.EAST, null)
    this.visited = false
    this.depth = 0
  }

  isLeaf() {
    const count = this.connectionCount()
    return count === 1
  }

  connectionCount() {
    let count = 0
    for (let dir of this.connections.keys()) {
      if (this.connections.get(dir)) {
        count += 1
      }
    }
    return count
  }

  link(cell: Cell, reflect: boolean = true) {
    if (reflect) {
      cell.link(this, false)
    }
    for (let dir of this.connections.keys()) {
      if (cell.pos.equals(this.pos.plus(dir))) {
        this.connections.set(dir, cell)
      }
    }
  }

  connectionsBits() {
    let bits = 0
    for (let dir of this.connections.keys()) {
      const cell = this.connections.get(dir)
      if (cell) {
        bits += (BITS_MAP.get(dir) || 0)
      }
    }
    return bits
  }

  formatConnections() {
    const found: string[] = []
    for (let dir of this.connections.keys()) {
      const connection = this.connections.get(dir)
      if (connection) {
        const name = dir.hasName()
        if (name) {
          found.push(name)
        }
      }
    }
    return `[${found.join(", ")}]`
  }

  toString() {
    return `Cell at ${this.pos.toString()} => ${this.formatConnections()}, Visited: ${this.visited}, Depth: ${this.depth}`
  }
}
