import Point from "./Point"

export default class PointCollider {
  constructor(
    public readonly points: Point[],
    public readonly tolerance: number = 32) {
  }

  collision(pos: Point) {
    let collision = false
    this.points?.forEach(point => {
      const diff = point.diff(pos)
      if (diff.x < this.tolerance && diff.y < this.tolerance) {
        collision = true
      }
    })
    return collision
  }
}
