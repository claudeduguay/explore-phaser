import { GameObjects } from "phaser";
import { IDrawSurface } from "./TreeLayout";
import Point from "../../../util/Point";

export class PhaserDrawSurface implements IDrawSurface {
  constructor(public readonly g: GameObjects.Graphics) {
  }

  draw_line(source: Point, target: Point): void {

  }

  draw_poly(points: Point[]) {

  }
}
