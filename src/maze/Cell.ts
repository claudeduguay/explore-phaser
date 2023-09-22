import BITS_MAP from "../util/Cardinal"
import Point from "../util/Point"

export default class Cell {

  parent?: Cell
  pos!: Point
  links = new Map<Point, Cell | null>()
  visited: boolean = false
  depth: number = 0

  constructor(x: number, y: number) {
    this.pos = new Point(x, y)
    this.clearLinks()
    this.visited = false
    this.depth = 0
  }

  isLeaf() {
    const count = this.connectionCount()
    return count === 1
  }

  connectionCount() {
    let count = 0
    for (let dir of this.links.keys()) {
      if (this.links.get(dir)) {
        count += 1
      }
    }
    return count
  }

  clearLinks() {
    this.links.set(Point.NORTH, null)
    this.links.set(Point.SOUTH, null)
    this.links.set(Point.WEST, null)
    this.links.set(Point.EAST, null)
  }

  link(cell: Cell, reflect: boolean = true) {
    if (reflect) {
      cell.link(this, false)
    }
    for (let dir of this.links.keys()) {
      if (cell.pos.equals(this.pos.plus(dir))) {
        this.links.set(dir, cell)
      }
    }
  }

  rechain(cell: Cell) {
    this.clearLinks()
    this.link(cell)
  }

  connectionsBits() {
    let bits = 0
    for (let dir of this.links.keys()) {
      const cell = this.links.get(dir)
      if (cell) {
        bits += (BITS_MAP.get(dir) || 0)
      }
    }
    return bits
  }

  formatConnections() {
    const found: string[] = []
    for (let dir of this.links.keys()) {
      const connection = this.links.get(dir)
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
