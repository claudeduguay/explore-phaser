import { GameObjects } from "phaser"
import { bezier, lerp } from "./MathUtil"

/*
>>> Sprite implements
Phaser.GameObjects.Components.Alpha, 
Phaser.GameObjects.Components.BlendMode, 
Phaser.GameObjects.Components.Depth, 
Phaser.GameObjects.Components.Flip, 
Phaser.GameObjects.Components.GetBounds, 
Phaser.GameObjects.Components.Mask, 
Phaser.GameObjects.Components.Origin, 
Phaser.GameObjects.Components.Pipeline, 
Phaser.GameObjects.Components.PostPipeline, 
Phaser.GameObjects.Components.ScrollFactor, 
Phaser.GameObjects.Components.Size, 
Phaser.GameObjects.Components.TextureCrop, 
Phaser.GameObjects.Components.Tint, 
Phaser.GameObjects.Components.Transform, 
Phaser.GameObjects.Components.Visible
*/
export interface IPointLike {
  x: number
  y: number
}

export function getSceneRelativePosition(object: GameObjects.GameObject) {
  // const parent = object.parentContainer
}

export default class Point {

  static ZERO = new Point(0, 0)
  static ONE = new Point(1, 1)
  static TWO = new Point(2, 2)

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

  bezier(control1: Point, control2: Point, p: Point, f: number) {
    return new Point(
      bezier(this.x, control1.x, control2.x, p.x, f),
      bezier(this.y, control1.y, control2.y, p.y, f),
    )
  }

  toKey() {
    return `${this.x}, ${this.y}`
  }

  toString() {
    return `{ x: ${this.x}, y: ${this.y} }`
  }
}

export function toWorldCoordinates(obj: GameObjects.Components.Transform): Point {
  const transform = obj.getWorldTransformMatrix()
  const transformed = transform.transformPoint(obj.x, obj.y)
  return new Point(transformed.x, transformed.y)
}
