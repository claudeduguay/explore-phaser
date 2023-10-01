import { Scene, GameObjects } from "phaser"
import Point from "../../../../util/Point";
import makeTileMap from "./TDTileMap";
import { generatePath, renderPath } from "./TDPath";
import { makeTimelinePreview } from "./TDTimeline";
import { IActiveValues } from "../TDPlayScene";
import IMapModel, { IMapPath } from "./IMapModel";
import Cell from "../../../../maze/Cell";

export default function generateMap(scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group,
  prunePath: boolean = true, showMaze: boolean = true) {

  const origin = new Point(0, 46)
  const cellSize = new Point(64, 64)
  const rows = 6
  const cols = 9

  const { path, maze } = generatePath(rows, cols, prunePath)

  if (showMaze) {
    if (prunePath) {
      makeTileMap(scene, asMapModel(path), origin, cellSize, rows, cols)
    } else {
      makeTileMap(scene, asMapModel(maze.grid.array), origin, cellSize, rows, cols)
    }
  }
  const { curve, points } = renderPath(scene, path, origin, cellSize)

  makeTimelinePreview(scene, active, enemyGroup, origin, curve, 0)
  return points
}

export function asMapModel(cells: Cell[]): IMapModel {
  const path: IMapPath = cells.map((cell: Cell) => ({ bits: cell.connectionsBits(), pos: cell.pos }))
  return { path }
}
