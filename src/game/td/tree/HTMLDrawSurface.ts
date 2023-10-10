import Point from "../../../util/Point";
import { IDrawSurface } from "./TreeLayout";

export class HTMLDrawSurface implements IDrawSurface {

  g: CanvasRenderingContext2D

  constructor(public readonly e: HTMLCanvasElement) {
    this.g = e.getContext("2d") as CanvasRenderingContext2D
  }

  clear(): void {
    this.g.fillStyle = "#9999CC"
    this.g.fillRect(0, 0, this.g.canvas.width, this.g.canvas.height)
  }

  drawLine(source: Point, target: Point, color: string, width: number) {
    this.g.strokeStyle = color
    this.g.lineWidth = width
    this.g.moveTo(source.x, source.y)
    this.g.lineTo(target.x, target.y)
    this.g.stroke()
  }

  drawPoly(points: Point[], color: string, width: number) {
    this.g.strokeStyle = color
    this.g.lineWidth = width
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      if (i === 0) {
        this.g.moveTo(point.x, point.y)
      } else {
        this.g.lineTo(point.x, point.y)
      }
    }
    this.g.stroke()
  }

}
