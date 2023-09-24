import { useEffect, useState } from "react";
import TDTower from "../../tower/TDTower";
import ITowerModel from "../../model/ITowerModel";
import { Scene, Textures } from "phaser";

export default function useCaptureTower(scene: Scene, model: ITowerModel, w: number = 64, h: number = 64): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    // Check if we already captured this texture, remove it (wasteful but we're trying to ensure new captures)
    if (scene.textures.exists(model.meta.capture)) {
      scene.textures.get(model.meta.capture)
      scene.textures.remove(model.meta.capture)
    }
    const capture = scene.textures.addDynamicTexture(model.meta.capture, w, h)
    Object.entries(scene.textures.list).forEach(([key, value]) => {
      if (value.type === "DynamicTexture") {
        console.log("Texture:", key, value.type)
      }
    })
    if (capture) {
      console.log("Start:", model.meta.capture)
      console.log("Capture:", capture)
      console.log("Capture Is:", capture instanceof Textures.DynamicTexture)
      console.log("Capture Type:", capture.type)
      console.log("Capture Source:", capture.source)

      const copy = new TDTower(scene, w / 2, h / 2)
      copy.angle = 90
      capture.draw(copy)
      capture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          setImageSrc(() => {
            console.log("Capturing:", model.meta.capture)
            console.log("Image:", img.src)
            capture.destroy()
            return img.src
          })
        }
      })

    }
  }, [scene, model, w, h, imageSrc])
  return imageSrc
}
