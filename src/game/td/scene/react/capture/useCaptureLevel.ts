import { GameObjects, Scene } from "phaser";
import { DEFAULT_CONFIG, TDTileMap } from "../../map/TDTileMap";
import { canvasSize } from "../../../../../util/SceneUtil";
import useCapture, { captureAndCacheTexture } from "./useCapture";
import { buildSummary } from "../../map/TDTimeline";
import { ILevelModel } from "../../map/ILevelModel";
import { useCallback } from "react";

// Can't be used with useCallback, so this code is duplicated
export function makeLevelRenderCallback(scene: Scene, level: ILevelModel, scale: number) {
  return (texture: GameObjects.RenderTexture) => {
    const { w, h } = canvasSize(scene)
    const copy = new TDTileMap(scene, 0, 0, DEFAULT_CONFIG)
    copy.setModel(level.path)
    copy.mainLayer.scale = scale
    copy.backgroundLayer.scale = scale
    texture.draw(copy)
    const summary = buildSummary(scene, 0, (h - 50) * scale, w / 2, 50, level.waves)
    summary.scale = scale * 2
    texture.draw(summary)
  }
}

export default function useCaptureLevel(scene: Scene, level: ILevelModel, scale: number = 0.15): string {
  const { w, h } = canvasSize(scene)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const render = useCallback(makeLevelRenderCallback(scene, level, scale), [scene, level, scale])
  return useCapture(scene, w * scale, (h + 50) * scale, render)
}

export function captureAndCacheLevel(scene: Scene, level: ILevelModel, scale: number = 0.15, key: string) {
  const { w, h } = canvasSize(scene)
  const render = makeLevelRenderCallback(scene, level, scale)
  captureAndCacheTexture(scene, w * scale, (h + 50) * scale, render, key)
}
