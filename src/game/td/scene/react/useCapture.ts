import { useEffect, useState } from "react";
import TDTower from "../../tower/TDTower";
import ITowerModel from "../../model/ITowerModel";
import TDPlayScene from "../TDPlayScene";

export default function useCapture(scene: TDPlayScene, config: ITowerModel, w: number = 64, h: number = 64): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    const capture = scene.textures.addDynamicTexture(config.meta.capture, w, h)
    if (capture) {
      const tower = new TDTower(scene, w / 2, h / 2)
      tower.angle = 90
      capture.draw(tower)
      capture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          console.log("Length:", img.src.length)
          setImageSrc(img.src)
        }
      })
      capture.destroy()
    }
  }, [scene, config, w, h])
  return imageSrc
}
