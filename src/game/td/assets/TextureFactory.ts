
import { Scene } from "phaser"
import { BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../util/Cardinal"
import IRenderFunction from "./util/IRenderFunction"
import { platformRendererFunctionFactory } from "./PlatformRenderer"
import { drawEllipse } from "./util/DrawUtil"

// Render to a TextureCanvas using ...renderers
export function renderCanvas(scene: Scene, key: string, w: number, h: number, ...renderers: IRenderFunction[]) {
  const canvas = scene.textures.createCanvas(key, w, h)
  const g = canvas?.context
  if (g) {
    renderers.forEach(renderer => renderer(g))
  }
  canvas?.refresh()
}

export function makePathTiles(scene: Scene, key: string, w: number, h: number, insetRatio = 0.25) {
  const count = 0b1111
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    const hasBit = (i: number, test: number): boolean => (i & test) !== 0
    const inset = (v: number) => v * insetRatio
    for (let i = 0; i < count; i++) {
      g.fillStyle = "#333333"
      const left = w * i
      const inside = { x: inset(w), y: inset(h), w: w - inset(w) * 2, h: h - inset(h) * 2 }
      const size = { w: w - inset(w), h: h - inset(h) }
      if (hasBit(i, BITS_NORTH)) {
        g.fillRect(left + inside.x, 0, inside.w, size.h)
      }
      if (hasBit(i, BITS_SOUTH)) {
        g.fillRect(left + inside.x, inside.y, inside.w, size.h)
      }
      if (hasBit(i, BITS_WEST)) {
        g.fillRect(left, inside.y, size.w, inside.h)
      }
      if (hasBit(i, BITS_EAST)) {
        g.fillRect(left + inside.x, inside.x, size.w, inside.h)
      }
    }
  }
  renderCanvas(scene, key, w * count, h, render)
}

export function makeHeightRects(scene: Scene, key: string, w: number, h: number, count: number = 16) {
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    for (let i = 0; i < count; i++) {
      const c = Math.floor(255 * i / count)
      const hex = c.toString(16).toUpperCase()
      g.fillStyle = `#${hex}${hex}${hex}`
      console.log(g.fillStyle)
      g.fillRect(w * i, 0, w, h)
    }
  }
  renderCanvas(scene, key, w * count, h, render)
}

export function makeEllipse(scene: Scene, key: string, w: number, h: number, color: string = "#FFA500") {
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    g.fillStyle = color
    drawEllipse(g, w / 2, h / 2, w / 2, h / 2)
    g.fill()
  }
  renderCanvas(scene, key, w, h, render)
}

export function makeTowerBase(scene: Scene, key: string, w: number, h: number) {
  const render: IRenderFunction = platformRendererFunctionFactory(0)
  renderCanvas(scene, key, w, h, render)
}

export function makeTowerTurret(scene: Scene, key: string, w: number, h: number) {
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    g.fillStyle = "#00FF00"
    g.strokeStyle = "#009900"
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(w * 0.2, h * 0.25)
    g.lineTo(w * 0.8, h * 0.25)
    g.lineTo(w, h)
    g.lineTo(0, h)
    g.closePath()
    g.fill()
    g.stroke()
  }
  renderCanvas(scene, key, w, h, render)
}

export function makeTowerGun(scene: Scene, key: string, w: number, h: number) {
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    g.fillStyle = "#996666"
    g.strokeStyle = "#FFFFFF"
    g.fillRect(0, 0, w, h)
    g.strokeRect(0, 0, w, h)
  }
  renderCanvas(scene, key, w, h, render)
}
