import { Scene, GameObjects } from "phaser"
import Point from "../../../../util/Point";
import makeTileMap, { DEFAULT_CONFIG, IMapConfig } from "./TDTileMap";
import { generatePath, renderPath } from "./TDPath";
import { makeTimeline } from "./TDTimeline";
import { IActiveValues } from "../TDPlayScene";
import { asMapModel } from "./IMapModel";

export default function generateMap(scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group,
  prunePath: boolean = true, showMaze: boolean = true) {

  const origin = new Point(0, 46)
  const config: IMapConfig = DEFAULT_CONFIG

  const { path, maze } = generatePath(config.rows, config.cols, prunePath)

  const model = prunePath ? asMapModel(path) : asMapModel(maze.grid.array)
  console.log("Path cells:", model.path.length)
  if (showMaze) {
    makeTileMap(scene, origin.x, origin.y, model, config)
  }
  const { curve, points } = renderPath(scene, model, origin, config.cellSize)

  makeTimeline(scene, active, enemyGroup, origin, curve, 0)
  return points
}
