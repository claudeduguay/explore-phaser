import { useEffect, useState } from "react";
import TDTower from "../../tower/TDTower";
import ITowerModel from "../../model/ITowerModel";
import { GameObjects, Scene } from "phaser";

export default function useCaptureTower(scene: Scene, model: ITowerModel, angle = 0): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    const capture: GameObjects.RenderTexture = new GameObjects.RenderTexture(scene, 0, 0, 64, 64)

    const copy = new TDTower(scene, 32, 32, model)
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

  }, [scene, model, angle, imageSrc])
  return imageSrc
}
