import TDTower from "../../../entity/tower/TDTower";
import { GameObjects, Scene } from "phaser";
import useCapture, { captureAndCacheTexture } from "./useCapture";
import ITowerModel from "../../../entity/model/ITowerModel";
import { useCallback } from "react";

export function makeTowerRenderCallback(scene: Scene, model?: ITowerModel, angle = 0) {
  return (texture: GameObjects.RenderTexture) => {
    if (model) {
      const copy = new TDTower(scene, 32, 32, model, true)
      copy.angle = angle
      texture.draw(copy)
    }
  }
}

export default function useCaptureTower(scene: Scene, model?: ITowerModel, angle = 0): string {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const render = useCallback(makeTowerRenderCallback(scene, model, angle), [scene, model, angle])
  return useCapture(scene, 64, 64, render, `${model?.key || "generic"}-tower`)
}

export function captureAndCacheTower(scene: Scene, model: ITowerModel, angle = 0) {
  const render = makeTowerRenderCallback(scene, model, angle)
  captureAndCacheTexture(scene, 64, 64, render, model.key)
}
