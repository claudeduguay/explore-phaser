import { Scene, GameObjects } from "phaser"
import Point from "../../../../util/geom/Point";
import makeTileMap, { DEFAULT_CONFIG, IMapConfig } from "./TDTileMap";
import { createCurve } from "./TDPath";
import { makeTimeline } from "./TDTimeline";
import ObservableValue from "../../value/ObservableValue";
import { ILevelModel } from "./ILevelModel";

export default function generateMap(scene: Scene, hud: Scene,
  health: ObservableValue<number>, credits: ObservableValue<number>,
  enemyGroup: GameObjects.Group, previewGroup: GameObjects.Group,
  mapOrigin: Point, model: ILevelModel) {

  const config: IMapConfig = DEFAULT_CONFIG
  const map = makeTileMap(scene, mapOrigin.x, mapOrigin.y, model.path, config)
  const points = map.getPathPoints()
  const curve = createCurve(points)

  const timeline = makeTimeline(scene, hud, health, credits, enemyGroup, previewGroup, curve, 0)
  return { map, points, timeline }
}
