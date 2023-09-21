type Point = { x: number, y: number }

export default class Cell {

  static UP = { x: 0, y: -1 }
  static DOWN = { x: 0, y: 1 }
  static LEFT = { x: -1, y: 0 }
  static RIGHT = { x: 1, y: 0 }

  static addPoints(p1: Point, p2: Point) {
    return { x: p1.x + p2.x, y: p1.y + p2.y }
  }
  pos!: Point
  connections = new Map<Point, Cell | null>()
  visited: boolean = false
  depth: number = 0

  constructor(x: number, y: number) {
    this.pos = { x, y }
    this.connections.set(Cell.UP, null)
    this.connections.set(Cell.DOWN, null)
    this.connections.set(Cell.LEFT, null)
    this.connections.set(Cell.RIGHT, null)
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
      if (cell.pos === Cell.addPoints(this.pos, dir)) {
        this.connections.set(dir, cell)
      }
    }
  }

  toString() {
    return `Cell at ${this.pos.x}, ${this.pos.y}: ${this.connections}, Visited: ${this.visited}, Depth: ${this.depth}`
  }
}