import { useEffect, useState } from "react";
import { GameObjects, Scene } from "phaser";
import IMapModel from "../map/IMapModel";
import { DEFAULT_CONFIG, TDTileMap } from "../map/TDTileMap";

export default function useCaptureTower(scene: Scene, model: IMapModel, scale: number = 0.15): string {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    const capture: GameObjects.RenderTexture = new GameObjects.RenderTexture(scene, 0, 0, 1100 * scale, 800 * scale)

    const copy = new TDTileMap(scene, 0, 0, DEFAULT_CONFIG)
    copy.setModel(model)
    copy.layer.scale = scale
    capture.draw(copy)

    capture.snapshot(img => {
      if (img instanceof HTMLImageElement) {
        setImageSrc(() => {
          capture.destroy()
          return img.src
        })
      }
    })

  }, [scene, model, scale, imageSrc])
  return imageSrc
}
