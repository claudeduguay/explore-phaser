import { useEffect, useState } from "react";
import TDTower from "../../tower/TDTower";
import { GameObjects } from "phaser";

export default function useCaptureTower(tower?: TDTower, angle = 0): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    if (tower) {
      const capture: GameObjects.RenderTexture = new GameObjects.RenderTexture(tower.scene, 0, 0, 64, 64)
      const copy = new TDTower(tower.scene, 32, 32, tower.model)
      copy.angle = angle
      capture.draw(copy)

      capture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          setImageSrc(() => {
            capture.destroy()
            return img.src
          })
        }
      })
    }
  }, [tower, angle, imageSrc])
  return imageSrc
}
