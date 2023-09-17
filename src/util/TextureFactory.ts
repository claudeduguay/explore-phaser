
import { Scene, GameObjects } from "phaser"

export function makeTowerBase(scene: Scene, key: string, w: number, h: number, segments: number = 4) {
  const g = new GameObjects.Graphics(scene)
  g.fillStyle(0x00FF00, 1.0)
  g.fillRoundedRect(0, 0, w, h, 5)
  g.lineStyle(2, 0xFF00FF, 1.0)
  g.strokeRoundedRect(0, 0, w, h, 5)
  // g.beginPath()
  // g.moveTo(m, m)
  // g.lineTo(w - m, m)
  // g.lineTo(w - m, h - m)
  // g.lineTo(m, h - m)
  // g.closePath()
  // g.fillPath()
  // g.strokePath()
  g.generateTexture(key)
}
