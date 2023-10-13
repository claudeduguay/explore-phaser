import { GameObjects, Scene } from "phaser";
import { DEFAULT_CONFIG, TDTileMap } from "../../map/TDTileMap";
import { canvasSize } from "../../../../../util/SceneUtil";
import useCapture, { captureAndCacheTexture } from "./useCapture";
import { buildSummary } from "../../map/TDTimeline";
import { ILevelModel } from "../../map/ILevelModel";

export function makeLevelRenderCallback(scene: Scene, level: ILevelModel, scale: number) {
  const { w, h } = canvasSize(scene)
  return (texture: GameObjects.RenderTexture) => {
    const copy = new TDTileMap(scene, 0, 0, DEFAULT_CONFIG)
    copy.setModel(level.path)
    copy.mainLayer.scale = scale
    texture.draw(copy)
    const summary = buildSummary(scene, 0, (h - 50) * scale, w / 2, 50, level.waves)
    summary.scale = scale * 2
    texture.draw(summary)
  }
}

export default function useCaptureLevel(scene: Scene, level: ILevelModel, scale: number = 0.15): string {
  const { w, h } = canvasSize(scene)
  const render = makeLevelRenderCallback(scene, level, scale)
  return useCapture(scene, w * scale, (h + 50) * scale, render)
}

export function captureAndCacheLevel(scene: Scene, level: ILevelModel, scale: number = 0.15, key: string) {
  const { w, h } = canvasSize(scene)
  const render = makeLevelRenderCallback(scene, level, scale)
  captureAndCacheTexture(scene, w * scale, (h + 50) * scale, render, key)
}
