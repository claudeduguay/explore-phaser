import { GameObjects, Scene, Textures } from "phaser";
import useCapture from "./useCapture";
import TDEnemy from "../../../entity/enemy/TDEnemy";

// Capture the first frame of an enemy
export default function useCaptureEnemy(scene: Scene, enemy?: TDEnemy, angle = 0): string {
  const render = (texture: GameObjects.RenderTexture) => {
    if (enemy) {
      const canvasKey = `${enemy.model.meta.key}_canvas`
      const image = scene.textures.get(canvasKey)
      const frame = new Textures.Frame(image, 0, 0, 0, 0, 32, 32)
      const copy = new GameObjects.Sprite(scene, 16, 16, canvasKey, 0)
      copy.setFrame(frame)
      texture.draw(copy)
    }
  }
  const key = `enemy-${enemy?.model.meta.key || "peep_weak"}`
  return useCapture(scene, 32, 32, render, key)
}
