import Point from "../../../util/Point";
import { IDrawSurface } from "./TreeLayout";

export class HTMLDrawSurface implements IDrawSurface {

  g: CanvasRenderingContext2D

  constructor(public readonly e: HTMLCanvasElement) {
    this.g = e.getContext("2d") as CanvasRenderingContext2D
  }

  draw_line(source: Point, target: Point) {
    this.g.moveTo(source.x, source.y)
    this.g.lineTo(target.x, target.y)
  }

  draw_poly(points: Point[]) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      if (i === 0) {
        this.g.moveTo(point.x, point.y)
      } else {
        this.g.lineTo(point.x, point.y)
      }
    }
  }

}
