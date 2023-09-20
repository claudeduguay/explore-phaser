
import { Scene, Display } from "phaser"

export function makeHeightRects(scene: Scene, key: string, w: number, h: number, count: number = 16) {
  const g = scene.make.graphics({}, false)
  for (let i = 0; i < count; i++) {
    const c = 255 * i / count
    const color = Display.Color.GetColor(c, c, c)
    g.fillStyle(color, 1.0)
    g.fillRect(w * i, 0, w, h)
  }
  g.generateTexture(key, w * count, h)
  g.destroy()
  return g
}

export function makeEllipse(scene: Scene, key: string, w: number, h: number, color: number = 0xFFA500) {
  const g = scene.make.graphics({}, false)
  g.fillStyle(color, 1.0)
  g.fillEllipse(w / 2, h / 2, w, h)
  g.generateTexture(key, w, h)
  g.destroy()
  return g
}

export function makeTowerBase(scene: Scene, key: string, w: number, h: number) {
  const g = scene.make.graphics({}, false)
  g.fillStyle(0x666666, 1.0)
  g.fillRoundedRect(0, 0, w, h, 16)
  g.generateTexture(key, w, h)
  g.destroy()
  return g
}

export function makeTowerTurret(scene: Scene, key: string, w: number, h: number) {
  const g = scene.make.graphics({}, false)
  g.fillStyle(0x00FF00, 1.0)
  g.lineStyle(2, 0x009900, 1.0)
  g.beginPath()
  g.moveTo(w * 0.2, h * 0.25)
  g.lineTo(w * 0.8, h * 0.25)
  g.lineTo(w, h)
  g.lineTo(0, h)
  g.closePath()
  g.fillPath()
  g.strokePath()
  g.generateTexture(key, w, h)
  g.destroy()
  return g
}

export function makeTowerGun(scene: Scene, key: string, w: number, h: number) {
  const g = scene.make.graphics({}, false)
  g.fillStyle(0x996666, 1.0)
  g.lineStyle(1, 0xFFFFFF, 1.0)
  g.fillRect(0, 0, w, h)
  g.strokeRect(0, 0, w, h)
  g.generateTexture(key, w, h)
  g.destroy()
  return g
}
