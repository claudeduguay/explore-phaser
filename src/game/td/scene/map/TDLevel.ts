import { Scene, GameObjects } from "phaser"
import Point from "../../../../util/Point";
import makeTileMap from "./TDTileMap";
import { generatePath, renderPath } from "./TDPath";
import { makeTimelinePreview } from "./TDTimeline";
import { IActiveValues } from "../TDPlayScene";

export default function generateMap(scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group,
  prunePath: boolean = true, showMaze: boolean = true) {

  const origin = new Point(0, 46)
  const cellSize = new Point(64, 64)
  const rows = 6
  const cols = 9

  const { path, maze } = generatePath(rows, cols, prunePath)

  if (showMaze) {
    if (prunePath) {
      makeTileMap(scene, path, origin, cellSize, rows, cols)
    } else {
      makeTileMap(scene, maze.grid.array, origin, cellSize, rows, cols)
    }
  }
  const { curve, points } = renderPath(scene, path, origin, cellSize)

  makeTimelinePreview(scene, active, enemyGroup, origin, curve, 0)
  return points
}

