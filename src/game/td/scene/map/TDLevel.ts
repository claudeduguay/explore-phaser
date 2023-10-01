import { Scene, GameObjects } from "phaser"
import Point from "../../../../util/Point";
import makeTileMap from "./TDTileMap";
import { generatePath, renderPath } from "./TDPath";
import { makeTimelinePreview } from "./TDTimeline";
import { IActiveValues } from "../TDPlayScene";
import { asMapModel } from "./IMapModel";

export default function generateMap(scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group,
  prunePath: boolean = true, showMaze: boolean = true) {

  const origin = new Point(0, 46)
  const cellSize = new Point(64, 64)
  const rows = 6
  const cols = 9

  const { path, maze } = generatePath(rows, cols, prunePath)

  const model = prunePath ? asMapModel(path) : asMapModel(maze.grid.array)
  if (showMaze) {
    if (prunePath) {
      makeTileMap(scene, model, origin, cellSize, rows, cols)
    } else {
      makeTileMap(scene, model, origin, cellSize, rows, cols)
    }
  }
  const { curve, points } = renderPath(scene, model, origin, cellSize)

  makeTimelinePreview(scene, active, enemyGroup, origin, curve, 0)
  return points
}
