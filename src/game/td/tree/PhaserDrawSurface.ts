import { GameObjects, Scene } from "phaser";
import { IDrawSurface } from "./TreeLayout";
import Point from "../../../util/geom/Point";
// import { canvasSize } from "../../../util/SceneUtil";

export default class PhaserDrawSurface implements IDrawSurface {
  g: GameObjects.Graphics
  constructor(public readonly scene: Scene) {
    this.g = scene.add.graphics()
  }

  clear(): void {
    // const { w, h } = canvasSize(this.scene)
    // this.g.fillStyle(0x9999CC)
    // this.g.fillRect(0, 0, w, h)
  }

  drawLine(source: Point, target: Point, color: string | number, width: number) {
    if (typeof color === "number") {
      this.g.lineStyle(width, color)
    }
    this.g.moveTo(source.x, source.y)
    this.g.lineTo(target.x, target.y)
    this.g.stroke()
  }

  drawPoly(points: Point[], color: string | number, width: number) {
    if (typeof color === "number") {
      this.g.lineStyle(width, color)
    }
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
