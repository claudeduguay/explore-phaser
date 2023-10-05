import { GameObjects } from "phaser";
import useCapture from "./useCapture";
import TDEnemy from "../../../enemy/TDEnemy";

export default function useCaptureEnemy(enemy: TDEnemy, angle = 0): string {
  const render = (texture: GameObjects.RenderTexture) => {
    if (enemy) {
      const copy = new TDEnemy(enemy.scene, 10, 10, enemy.model, enemy.path)
      texture.draw(copy)
    }
  }
  const key = `enemy-${enemy.model.meta.body}`
  const imageSrc = useCapture(enemy.scene, 20, 20, render, key)
  return imageSrc
}
