
import { Scene } from "phaser"

export function makeTowerBase(scene: Scene, key: string, w: number, h: number) {
  const g = scene.make.graphics({}, false)
  g.fillStyle(0x666666, 1.0)
  g.fillRoundedRect(0, 0, w, h, 20)
  g.generateTexture(key, w, h)
  g.destroy()
  return g
}

export function makeTowerTurret(scene: Scene, key: string, w: number, h: number) {
  const g = scene.make.graphics({}, false)
  g.fillStyle(0x00FF00, 1.0)
  g.beginPath()
  const c = w / 2
  g.moveTo(c - c * 0.5, 0)
  g.lineTo(c + c * 0.5, 0)
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
