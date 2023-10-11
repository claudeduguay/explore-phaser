import { GameObjects, Scene } from "phaser"
import { useEffect, useState } from "react"

export default function useCapture(scene: Scene, w: number, h: number, render: (texture: GameObjects.RenderTexture) => void, key?: string) {
  const [imageSrc, setImageSrc] = useState<string>("")
  useEffect(() => {
    const textCache = scene.cache.text
    if (key && textCache.exists(key)) {
      setImageSrc(scene.cache.text.get(key))
    }
    if (!key || !textCache.exists(key)) {
      const texture: GameObjects.RenderTexture = new GameObjects.RenderTexture(scene, 0, 0, w, h)
      render(texture)
      texture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          if (key) {
            textCache.add(key, img.src)
          }
          setImageSrc(img.src)
          texture.destroy()
        }
      })
    }
  }, [scene, w, h, render, key])
  return imageSrc
}

export function captureAndCacheTexture(scene: Scene, w: number, h: number, render: (texture: GameObjects.RenderTexture) => void, key: string) {
  const textureIsCached = scene.textures.exists(key)
  const imageIsCached = scene.cache.text.exists(key)
  if (!textureIsCached || !imageIsCached) {
    const texture: GameObjects.RenderTexture = new GameObjects.RenderTexture(scene, 0, 0, w, h)
    render(texture)
    if (!textureIsCached) {
      scene.textures.addRenderTexture(`${key}-texture`, texture)
    }
    if (!imageIsCached) {
      texture.snapshot(img => {
        if (img instanceof HTMLImageElement) {
          scene.cache.text.add(`${key}-image`, img.src)
        }
      })
    }
  }
}
