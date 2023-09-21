import Point from "../util/Point"

export default class Cell {

  pos!: Point
  connections = new Map<Point, Cell | null>()
  visited: boolean = false
  depth: number = 0

  constructor(x: number, y: number) {
    this.pos = new Point(x, y)
    this.connections.set(Point.UP, null)
    this.connections.set(Point.DOWN, null)
    this.connections.set(Point.LEFT, null)
    this.connections.set(Point.RIGHT, null)
    this.visited = false
    this.depth = 0
  }

  connection_count() {
    let count = 0
    for (let dir of this.connections.keys()) {
      if (this.connections.get(dir) !== null) {
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
      if (cell.pos === this.pos.plus(dir)) {
        this.connections.set(dir, cell)
      }
    }
  }

  toString() {
    return `Cell at ${this.pos.x}, ${this.pos.y}: ${this.connections}, Visited: ${this.visited}, Depth: ${this.depth}`
  }
}