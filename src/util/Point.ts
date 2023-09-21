
export default class Point {

  static NORTH = new Point(0, -1)
  static SOUTH = new Point(0, 1)
  static WEST = new Point(-1, 0)
  static EAST = new Point(1, 0)

  constructor(public x: number, public y: number) {
  }

  equals(p: Point) {
    return this.x === p.x && this.y === p.y
  }

  hasName(): string | undefined {
    if (this.equals(Point.NORTH)) {
      return "NORTH"
    }
    if (this.equals(Point.SOUTH)) {
      return "SOUTH"
    }
    if (this.equals(Point.WEST)) {
      return "WEST"
    }
    if (this.equals(Point.EAST)) {
      return "EAST"
    }
  }

  plus(p: Point) {
    return new Point(this.x + p.x, this.y + p.y)
  }

  times(p: Point) {
    return new Point(this.x * p.x, this.y * p.y)
  }

  toString() {
    return `{ x: ${this.x}, y: ${this.y} }`
  }
}
