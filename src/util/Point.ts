import { lerp } from "./MathUtil"


export interface IPointLike {
  x: number
  y: number
}

export default class Point {

  static NORTH = new Point(0, -1)
  static SOUTH = new Point(0, 1)
  static WEST = new Point(-1, 0)
  static EAST = new Point(1, 0)

  constructor(public x: number = 0, public y: number = 0) {
  }

  static fromPointLike({ x, y }: IPointLike) {
    return new Point(x, y)
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

  plus(p: IPointLike) {
    return new Point(this.x + p.x, this.y + p.y)
  }

  minus(p: IPointLike) {
    return new Point(this.x - p.x, this.y - p.y)
  }

  times(p: IPointLike) {
    return new Point(this.x * p.x, this.y * p.y)
  }

  div(p: IPointLike) {
    return new Point(this.x / p.x, this.y / p.y)
  }

  diff(p: IPointLike) {
    return new Point(Math.abs(this.x - p.x), Math.abs(this.y - p.y))
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  lerp(p: IPointLike, f: number) {
    return new Point(
      lerp(this.x, p.x, f),
      lerp(this.y, p.y, f)
    )
  }

  toKey() {
    return `${this.x}, ${this.y}`
  }

  toString() {
    return `{ x: ${this.x}, y: ${this.y} }`
  }
}
