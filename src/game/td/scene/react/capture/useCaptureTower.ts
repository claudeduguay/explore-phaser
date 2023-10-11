import TDTower from "../../../entity/tower/TDTower";
import { GameObjects, Scene } from "phaser";
import useCapture, { captureAndCacheTexture } from "./useCapture";

export function makeTowerRenderCallback(tower?: TDTower, angle = 0) {
  return (texture: GameObjects.RenderTexture) => {
    if (tower) {
      const copy = new TDTower(tower.scene, 32, 32, tower.model)
      copy.angle = angle
      texture.draw(copy)
    }
  }
}

export default function useCaptureTower(scene: Scene, tower?: TDTower, angle = 0): string {
  const render = makeTowerRenderCallback(tower, angle)
  const key = tower?.model.meta.key ? `tower-${tower?.model.meta.key}` : undefined
  return useCapture(scene, 64, 64, render, key)
}

export function captureAndCacheTower(scene: Scene, tower: TDTower, angle = 0) {
  const render = makeTowerRenderCallback(tower, angle)
  captureAndCacheTexture(scene, 64, 64, render, tower.model.meta.key)
}
