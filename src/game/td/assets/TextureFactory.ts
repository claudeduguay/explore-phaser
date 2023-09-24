
import { Scene } from "phaser"
import { BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../util/Cardinal"
import IRenderFunction from "./util/IRenderFunction"
import { IPlatformOptions, platformRendererFunctionFactory } from "./PlatformFactory"
import { drawEllipse, rotated } from "./util/DrawUtil"
import { ITurretOptions, turretRendererFunctionFactory } from "./TurretFactory"
import { IProjectorOptions, projectorRendererFunctionFactory } from "./ProjectorFactory"
import { pathRendererFunctionFactory } from "./PathFactory"

// Render to a TextureCanvas using ...renderers
export function renderCanvas(scene: Scene, key: string, w: number, h: number, ...renderers: IRenderFunction[]) {
  const canvas = scene.textures.createCanvas(key, w, h)
  const g = canvas?.context
  if (g) {
    renderers.forEach(renderer => renderer(g))
  }
  canvas?.refresh()
}

export function renderImage(g: CanvasRenderingContext2D, renderer: IRenderFunction,
  x: number, y: number, w: number, h: number, a: number = 0) {
  const cellRenderCanvas = document.createElement("canvas") as HTMLCanvasElement
  const context = cellRenderCanvas.getContext("2d")
  cellRenderCanvas.width = w
  cellRenderCanvas.height = h
  if (context) {
    rotated(context, renderer, a)
    // renderer(context)
    g.drawImage(cellRenderCanvas, x, y)
  }
}

export function makePathTiles(scene: Scene, key: string, w: number, h: number, insetRatio = 0.25) {
  const count = 0b1111
  const straightPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "straight", beltInset: insetRatio })
  const endPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "end", beltInset: insetRatio })
  const turnPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "turn", beltInset: insetRatio })
  const tPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "t", beltInset: insetRatio })
  const xPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "x", beltInset: insetRatio })

  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    for (let i = 0; i <= count; i++) {
      const x = w * i

      // ENDS
      if (i === (BITS_NORTH)) {
        renderImage(g, endPathRender, x, 0, w, h)
      }
      if (i === (BITS_SOUTH)) {
        renderImage(g, endPathRender, x, 0, w, h, 180)
      }
      if (i === (BITS_EAST)) {
        renderImage(g, endPathRender, x, 0, w, h, 90)
      }
      if (i === (BITS_WEST)) {
        renderImage(g, endPathRender, x, 0, w, h, 270)
      }

      // STRAIGHT
      if (i === (BITS_NORTH + BITS_SOUTH)) {
        renderImage(g, straightPathRender, x, 0, w, h)
      }
      if (i === (BITS_WEST + BITS_EAST)) {
        renderImage(g, straightPathRender, x, 0, w, h, 90)
      }

      // TURNS
      if (i === (BITS_SOUTH + BITS_WEST)) {
        renderImage(g, turnPathRender, x, 0, w, h)
      }
      if (i === (BITS_WEST + BITS_NORTH)) {
        renderImage(g, turnPathRender, x, 0, w, h, 90)
      }
      if (i === (BITS_NORTH + BITS_EAST)) {
        renderImage(g, turnPathRender, x, 0, w, h, 180)
      }
      if (i === (BITS_EAST + BITS_SOUTH)) {
        renderImage(g, turnPathRender, x, 0, w, h, 270)
      }

      // BRANCH
      if (i === (BITS_EAST + BITS_WEST + BITS_SOUTH)) {
        renderImage(g, tPathRender, x, 0, w, h)
      }
      if (i === (BITS_NORTH + BITS_SOUTH + BITS_WEST)) {
        renderImage(g, tPathRender, x, 0, w, h, 90)
      }
      if (i === (BITS_EAST + BITS_WEST + BITS_NORTH)) {
        renderImage(g, tPathRender, x, 0, w, h, 180)
      }
      if (i === (BITS_NORTH + BITS_SOUTH + BITS_EAST)) {
        renderImage(g, tPathRender, x, 0, w, h, 270)
      }

      // CROSS
      if (i === (BITS_NORTH + BITS_SOUTH + BITS_EAST + BITS_WEST)) {
        renderImage(g, xPathRender, x, 0, w, h, 0)
      }

      // g.strokeStyle = "#00FF00"
      // g.lineWidth = 2
      // g.rect(x, 0, w, h)
      // g.stroke()
    }
  }
  renderCanvas(scene, key, w * (count + 1), h, render)
}

export function makeHeightRects(scene: Scene, key: string, w: number, h: number, count: number = 16) {
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    for (let i = 0; i < count; i++) {
      const c = Math.floor(255 * i / count)
      const hex = c.toString(16).toUpperCase()
      g.fillStyle = `#${hex}${hex}${hex}`
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

export function makePlatform(scene: Scene, key: string, w: number, h: number, options?: IPlatformOptions) {
  const render: IRenderFunction = platformRendererFunctionFactory(0, options)
  renderCanvas(scene, key, w, h, render)
}

export function makeTowerTurret(scene: Scene, key: string, w: number, h: number, options?: Partial<ITurretOptions>) {
  const render: IRenderFunction = turretRendererFunctionFactory(0, options)
  renderCanvas(scene, key, w, h, render)
}

export function makeTowerProjector(scene: Scene, key: string, w: number, h: number, options?: Partial<IProjectorOptions>) {
  const render: IRenderFunction = projectorRendererFunctionFactory(0, options)
  renderCanvas(scene, key, w, h, render)
}
