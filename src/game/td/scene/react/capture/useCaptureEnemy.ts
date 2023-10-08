import { GameObjects, Scene } from "phaser";
import useCapture from "./useCapture";
import TDEnemy from "../../../enemy/TDEnemy";

export default function useCaptureEnemy(scene: Scene, enemy?: TDEnemy, angle = 0): string {
  const render = (texture: GameObjects.RenderTexture) => {
    if (enemy) {
      const copy = new TDEnemy(scene, 16, 16, enemy.model)
      texture.draw(copy)
    }
  }
  const key = `enemy-${enemy?.model.meta.key || "peep_weak"}`
  return useCapture(scene, 32, 32, render, key)
}
