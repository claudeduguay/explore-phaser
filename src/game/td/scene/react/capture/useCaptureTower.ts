import TDTower from "../../../tower/TDTower";
import { GameObjects } from "phaser";
import useCapture from "./useCapture";

export default function useCaptureTower(tower?: TDTower, angle = 0): string {
  const render = (texture: GameObjects.RenderTexture) => {
    if (tower) {
      const copy = tower.scene.add.tower(32, 32, tower.model)
      copy.angle = angle
      texture.draw(copy)
    }
  }
  const imageSrc = useCapture(64, 64, render, tower?.scene)
  return imageSrc
}
