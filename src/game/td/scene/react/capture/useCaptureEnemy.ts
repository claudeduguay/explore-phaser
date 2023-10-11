import { GameObjects, Scene, Textures } from "phaser";
import useCapture, { captureAndCacheTexture } from "./useCapture";
import TDEnemy from "../../../entity/enemy/TDEnemy";

export function makeEnemyRenderCallback(scene: Scene, enemy?: TDEnemy) {
  return (texture: GameObjects.RenderTexture) => {
    if (enemy) {
      const canvasKey = `${enemy.model.meta.key}_canvas`
      const image = scene.textures.get(canvasKey)
      const frame = new Textures.Frame(image, 0, 0, 0, 0, 32, 32)
      const copy = new GameObjects.Sprite(scene, 16, 16, canvasKey, 0)
      copy.setFrame(frame)
      texture.draw(copy)
    }
  }
}

// Capture the first frame of an enemy
export default function useCaptureEnemy(scene: Scene, enemy?: TDEnemy, angle = 0): string {
  const render = makeEnemyRenderCallback(scene, enemy)
  const key = `enemy-${enemy?.model.meta.key || "peep_weak"}`
  return useCapture(scene, 32, 32, render, key)
}


export function captureAndCacheEnemy(scene: Scene, enemy?: TDEnemy, angle = 0) {
  const render = makeEnemyRenderCallback(scene, enemy)
  if (enemy?.model.meta.key) {
    captureAndCacheTexture(scene, 32, 32, render, enemy?.model.meta.key)
  }
}