import TDTower from "../../../tower/TDTower";
import { GameObjects, Scene } from "phaser";
import useCapture from "./useCapture";

export default function useCaptureTower(scene: Scene, tower?: TDTower, angle = 0): string {
  const render = (texture: GameObjects.RenderTexture) => {
    if (tower) {
      const copy = new TDTower(tower.scene, 32, 32, tower.model)
      copy.angle = angle
      texture.draw(copy)
    }
  }
  const key = tower?.model.meta.key ? `tower-${tower?.model.meta.key}` : undefined
  return useCapture(scene, 64, 64, render, key)
}
