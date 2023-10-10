import { GameObjects } from "phaser";
import { IDrawSurface } from "./TreeLayout";
import Point from "../../../util/Point";

export class PhaserDrawSurface implements IDrawSurface {
  constructor(public readonly g: GameObjects.Graphics) {
  }

  clear(): void {
  }

  drawLine(source: Point, target: Point): void {

  }

  drawPoly(points: Point[]) {

  }
}
