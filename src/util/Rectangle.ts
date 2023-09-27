import Vector from "./Vector";

export default class Rectangle {

  readonly x!: number;
  readonly y!: number;
  readonly width!: number;
  readonly height!: number;

  constructor(pos: Vector, size: Vector);
  constructor(x: number, y: number, width: number, height: number);
  constructor(
    xOrPosVector: number | Vector = 0,
    yOrSizeVector: number | Vector = 0,
    width?: number, height?: number) {
    if (xOrPosVector instanceof Vector &&
      yOrSizeVector instanceof Vector) {
      this.x = xOrPosVector.x;
      this.y = xOrPosVector.y;
      this.width = yOrSizeVector.x;
      this.height = yOrSizeVector.y;
    } else if (typeof xOrPosVector === "number" &&
      typeof yOrSizeVector === "number" &&
      width !== undefined && height !== undefined) {
      this.x = xOrPosVector;
      this.y = yOrSizeVector;
      this.width = width;
      this.height = height;
    }
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  get rx() {
    return this.width / 2;
  }

  get ry() {
    return this.height / 2;
  }

  get cx() {
    return this.x + this.rx;
  }

  get cy() {
    return this.y + this.ry;
  }

  inside(x: number, y: number) {
    return x >= this.x && y >= this.y && x <= this.right && y <= this.bottom;
  }

}
