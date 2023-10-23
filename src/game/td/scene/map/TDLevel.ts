import { Scene, GameObjects } from "phaser"
import Point from "../../../../util/geom/Point";
import makeTileMap, { DEFAULT_CONFIG, IMapConfig } from "./TDTileMap";
import { generatePath, renderPath } from "./TDPath";
import { makeTimeline } from "./TDTimeline";
import { IActiveValues } from "../TDPlayScene";
import { asPathModel } from "./IPathModel";

export default function generateMap(scene: Scene, active: IActiveValues,
  enemyGroup: GameObjects.Group, mapOrigin: Point,
  prunePath: boolean = true, showMaze: boolean = true) {

  const config: IMapConfig = DEFAULT_CONFIG

  const { path, maze } = generatePath(config.rows, config.cols, prunePath)

  const model = prunePath ? asPathModel(path) : asPathModel(maze.grid.array)
  if (showMaze) {
    makeTileMap(scene, mapOrigin.x, mapOrigin.y, model, config)
  }
  const { curve, points } = renderPath(scene, model, mapOrigin, config.cellSize)

  makeTimeline(scene, active, enemyGroup, mapOrigin, curve, 0)
  return points
}
