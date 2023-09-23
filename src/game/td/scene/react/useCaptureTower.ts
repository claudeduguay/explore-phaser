import { useEffect, useState } from "react";
import TDTower from "../../tower/TDTower";
import ITowerModel from "../../model/ITowerModel";
import { Scene } from "phaser";

export default function useCaptureTower(scene: Scene, model: ITowerModel, w: number = 64, h: number = 64): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    const capture = scene.textures.addDynamicTexture(model.meta.capture, w, h)
    if (capture) {
      const copy = new TDTower(scene, w / 2, h / 2)
      copy.angle = 90
      capture.draw(copy)
      capture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          setImageSrc(img.src)
        }
      })
      capture.destroy()
    }
  }, [scene, model, w, h])
  return imageSrc
}
