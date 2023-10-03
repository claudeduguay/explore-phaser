import { GameObjects, Scene } from "phaser"
import { useEffect, useState } from "react"

export default function useCapture(w: number, h: number, render: (texture: GameObjects.RenderTexture) => void, scene?: Scene) {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    if (scene) {
      const texture: GameObjects.RenderTexture = new GameObjects.RenderTexture(scene, 0, 0, w, h)
      render(texture)
      texture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          setImageSrc(() => {
            texture.destroy()
            return img.src
          })
        }
      })
    }
  }, [scene, w, h, render])
  return imageSrc
}
