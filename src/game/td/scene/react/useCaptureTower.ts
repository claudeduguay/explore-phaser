import { useEffect, useState } from "react";
import TDTower from "../../tower/TDTower";

export default function useCaptureTower(tower: TDTower, w: number = 64, h: number = 64): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    const capture = tower.scene.textures.addDynamicTexture(tower.model.meta.capture, w, h)
    if (capture) {
      const copy = new TDTower(tower.scene, w / 2, h / 2)
      copy.angle = 90
      capture.draw(copy)
      capture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          console.log("Length:", img.src.length)
          setImageSrc(img.src)
        }
      })
      capture.destroy()
    }
  }, [tower, w, h])
  return imageSrc
}
