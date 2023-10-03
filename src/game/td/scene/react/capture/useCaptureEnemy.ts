import { GameObjects } from "phaser";
import useCapture from "./useCapture";
import TDEnemy from "../../../enemy/TDEnemy";

export default function useCaptureEnemy(enemy?: TDEnemy, angle = 0): string {
  const render = (texture: GameObjects.RenderTexture) => {
    if (enemy) {
      const copy = new TDEnemy(enemy.scene, 10, 10, enemy.key, enemy.path, enemy.model)
      texture.draw(copy)
    }
  }
  const imageSrc = useCapture(20, 20, render, enemy?.scene)
  return imageSrc
}
