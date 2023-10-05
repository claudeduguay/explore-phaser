import { GameObjects, Scene } from "phaser"
import { useEffect, useState } from "react"

export default function useCapture(scene: Scene, w: number, h: number, render: (texture: GameObjects.RenderTexture) => void, key?: string) {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    if (key && scene.cache.text.exists(key)) {
      setImageSrc(scene.cache.text.get(key))
    }
    const texture: GameObjects.RenderTexture = new GameObjects.RenderTexture(scene, 0, 0, w, h)
    render(texture)
    texture.snapshot(img => {
      if (img instanceof HTMLImageElement) {
        if (key && !scene.cache.text.exists(key)) {
          scene.cache.text.add(key, img.src)
        }
        setImageSrc(img.src)
        texture.destroy()
      }
    })
  }, [scene, w, h, render, key])
  return imageSrc
}
