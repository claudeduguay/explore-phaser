import { useEffect, useState } from "react";
import TDTower from "../../tower/TDTower";
import ITowerModel from "../../model/ITowerModel";
import { Scene, Textures } from "phaser";

export default function useCaptureTower(scene: Scene, model: ITowerModel, w: number = 64, h: number = 64): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    // Check if we already captured this texture, remove it (wasteful but we're trying to ensure new captures)
    // if (scene.textures.exists(model.meta.capture)) {
    //   scene.textures.get(model.meta.capture)
    //   scene.textures.remove(model.meta.capture)
    // }

    // Clear all dynamic textures
    const dynamic = new Set<Textures.Texture>()
    scene.textures.each((texture: any) => {
      if (texture.type === "DynamicTexture") {
        dynamic.add(texture)
      }
    }, scene)
    dynamic.forEach(texture => {
      if (scene.textures.exists(texture.key)) {
        console.log("Key:", texture.key)
        scene.textures.remove(texture.key)
      }
    }, scene)
    let count = 0
    scene.textures.each((texture: any) => {
      if (texture.type === "DynamicTexture") {
        console.log("Found:", texture.key)
        count++
      }
    }, scene)
    console.log("Count:", count)

    const capture: Textures.DynamicTexture | null = scene.textures.addDynamicTexture(model.meta.capture, w, h)
    if (capture) {
      console.log("Start:", model.meta.capture)
      console.log("Capture:", capture)
      console.log("Capture Is:", capture instanceof Textures.DynamicTexture)
      console.log("Capture Type:", capture.type)

      const copy = new TDTower(scene, w / 2, h / 2)
      copy.angle = 90
      capture.draw(copy)

      capture.snapshot(img => {
        // PROBLEM: This callback keeps returning the same image
        if (img instanceof HTMLImageElement) {
          setImageSrc(() => {
            console.log("Capturing:", model.meta.capture)
            console.log("Image:", img.src)
            // capture.destroy()
            return img.src
          })
        }
      })

    }
  }, [scene, model, w, h, imageSrc])
  return imageSrc
}
