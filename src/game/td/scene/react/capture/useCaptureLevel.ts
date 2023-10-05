import { GameObjects, Scene } from "phaser";
import { DEFAULT_CONFIG, TDTileMap } from "../../map/TDTileMap";
import { canvasSize } from "../../../../../util/SceneUtil";
import useCapture from "./useCapture";
import { ILevelModel } from "../GameMaps";
import { buildSummary } from "../../map/TDTimeline";

export default function useCaptureLevel(scene: Scene, level: ILevelModel, scale: number = 0.15): string {
  const { w, h } = canvasSize(scene)
  const render = (texture: GameObjects.RenderTexture) => {
    const copy = new TDTileMap(scene, 0, 20, DEFAULT_CONFIG)
    copy.setModel(level.map)
    copy.layer.scale = scale
    texture.draw(copy)
    const summary = buildSummary(scene, 0, 0, w / 2, 50, level.waves)
    summary.scale = scale * 2
    texture.draw(summary)
  }
  return useCapture(w * scale, (h + 50) * scale, render, scene)
}
