
export default class Point {

  static UP = new Point(0, -1)
  static DOWN = new Point(0, 1)
  static LEFT = new Point(-1, 0)
  static RIGHT = new Point(1, 0)

  constructor(public x: number, public y: number) {
  }

  plus(p: Point) {
    return new Point(this.x + p.x, this.y + p.y)
  }
}
