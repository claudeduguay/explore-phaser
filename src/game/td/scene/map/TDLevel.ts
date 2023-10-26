import { Scene, GameObjects } from "phaser"
import Point from "../../../../util/geom/Point";
import makeTileMap, { DEFAULT_CONFIG, IMapConfig } from "./TDTileMap";
import { generatePath, createCurve } from "./TDPath";
import { makeTimeline } from "./TDTimeline";
import { asPathModel } from "./IPathModel";
import ObservableValue from "../../value/ObservableValue";

export default function generateMap(scene: Scene, hud: Scene,
  health: ObservableValue<number>, credits: ObservableValue<number>,
  enemyGroup: GameObjects.Group, mapOrigin: Point,
  prunePath: boolean = true) {

  const config: IMapConfig = DEFAULT_CONFIG

  const { path, maze } = generatePath(config.rows, config.cols, prunePath)

  const model = prunePath ? asPathModel(path) : asPathModel(maze.grid.array)
  const map = makeTileMap(scene, mapOrigin.x, mapOrigin.y, model, config)
  const points = map.getPathPoints()
  const curve = createCurve(points)

  makeTimeline(scene, hud, health, credits, enemyGroup, mapOrigin, curve, 0)
  return { map, points }
}
