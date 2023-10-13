
import { Scene } from "phaser"
import { BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../util/Cardinal"
import IRenderFunction from "../../../util/IRenderFunction"
import { IPlatformOptions, platformRendererFunctionFactory } from "./PlatformFactory"
import { drawEllipse, rotated } from "../../../util/DrawUtil"
import { ITurretOptions, turretRendererFunctionFactory } from "./TurretFactory"
import { IWeaponOptions, weaponRendererFunctionFactory } from "./WeaponFactory"
import { pathRendererFunctionFactory } from "./PathFactory"
import { ILandscapeOptions, landscapeRendererFunctionFactory } from "./LandscapeFactory"
import { IPeepOptions, peepRendererFunctionFactory } from "./PeepFactory"

// Render to a TextureCanvas using ...renderers
export function renderCanvas(scene: Scene, key: string, w: number, h: number, ...renderers: IRenderFunction[]) {
  const canvas = scene.textures.createCanvas(key, w, h)
  const g = canvas?.context
  if (g) {
    renderers.forEach(renderer => renderer(g))
  }
  canvas?.refresh()
  return canvas
}

/*
// BUG IN PHASER 3 addSprite function
addSpriteSheet: function (key, source, config, dataSource)
{
    var texture = null;

    if (source instanceof Texture)
    {
        key = texture.key;   // <<< texture is always null (initialized right above), should be "key = source.key")
        texture = source;
    }
*/
export function renderSpritesheet(scene: Scene, key: string, w: number, h: number, frameSize: number = 15, ...renderers: IRenderFunction[]) {
  const canvas = renderCanvas(scene, `${key}_canvas`, w, h, ...renderers)
  if (canvas) {
    // Note: Functional workaround for now is to use "canvas.canvas as any"
    // Function accepts HTMLCanvasElement despite HTMLImageElement type def.
    scene.textures.addSpriteSheet(key, canvas.canvas as any, {
      frameWidth: frameSize,
      frameHeight: frameSize,
      startFrame: 0,
      endFrame: -1,
      margin: 0,
      spacing: 0
    })
  }
  return canvas
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

// options: { type: "grass" } })
export function makeLandscapeTile(scene: Scene, key: string, config: ITextureConfig<Partial<ILandscapeOptions>>) {
  const render: IRenderFunction = landscapeRendererFunctionFactory(0, config.options)
  renderCanvas(scene, key, config.size.x, config.size.y, render)
}

export function makePathTiles(scene: Scene, key: string, w: number, h: number, appendLandscape: boolean = true, insetRatio = 0.25) {
  const count = 0b1111
  const straightPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "straight", beltInset: insetRatio })
  const endPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "end", beltInset: insetRatio })
  const turnPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "turn", beltInset: insetRatio })
  const tPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "t", beltInset: insetRatio })
  const xPathRender: IRenderFunction = pathRendererFunctionFactory(0, { type: "x", beltInset: insetRatio })

  let render: IRenderFunction = (g: CanvasRenderingContext2D) => {
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

      // Note: May not need to use the same tileset
      if (appendLandscape) {
        const renderGrass: IRenderFunction = landscapeRendererFunctionFactory(0, { type: "grass" })
        renderImage(g, renderGrass, 0, h, 64, 64, 1.0)
      }
    }
  }
  renderCanvas(scene, key, w * (count + 1), appendLandscape ? h * 2 : h, render)
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

export function makeRect(scene: Scene, key: string, w: number, h: number,
  fillStyle: { color?: string, alpha?: number } = { color: "#FFA500", alpha: 1 }) {
  console.log("Rect size:", { w, h })
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    if (fillStyle.color) {
      g.fillStyle = fillStyle.color
    }
    if (fillStyle.alpha) {
      g.globalAlpha = fillStyle.alpha
    }
    g.rect(0, 0, w, h)
    g.fill()
  }
  renderCanvas(scene, key, w, h, render)
}

export function makeEllipse(scene: Scene, key: string, w: number, h: number,
  fillStyle: { color?: string, alpha?: number } = { color: "#FFA500", alpha: 1 }) {
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    if (fillStyle.color) {
      g.fillStyle = fillStyle.color
    }
    if (fillStyle.alpha) {
      g.globalAlpha = fillStyle.alpha
    }
    drawEllipse(g, w / 2, h / 2, w / 2, h / 2)
    g.fill()
  }
  renderCanvas(scene, key, w, h, render)
}

export interface ITextureConfig<T> {
  size: { x: number, y: number },
  options: Partial<T>
}

export function makeTowerPlatform(scene: Scene, key: string, config: ITextureConfig<Partial<IPlatformOptions>>) {
  const render: IRenderFunction = platformRendererFunctionFactory(0, config.options)
  renderCanvas(scene, key, config.size.x, config.size.y, render)
}

export function makeTowerTurret(scene: Scene, key: string, config: ITextureConfig<Partial<ITurretOptions>>) {
  const render: IRenderFunction = turretRendererFunctionFactory(0, config.options)
  renderCanvas(scene, key, config.size.x, config.size.y, render)
}

export function makeTowerWeapon(scene: Scene, key: string, config: ITextureConfig<Partial<IWeaponOptions>>) {
  const render: IRenderFunction = weaponRendererFunctionFactory(0, config.options)
  renderCanvas(scene, key, config.size.x, config.size.y, render)
}

export function makePeep(scene: Scene, key: string, w: number, h: number, options: Partial<IPeepOptions>, count: number = 16) {
  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    for (let i = 0; i < count; i++) {
      const frameIndexFraction = i / count
      const renderPeepEast: IRenderFunction = peepRendererFunctionFactory(frameIndexFraction, { ...options, type: "east" })
      renderImage(g, renderPeepEast, w * i, 0, w, h)
      const renderPeepSouth: IRenderFunction = peepRendererFunctionFactory(frameIndexFraction, { ...options, type: "south" })
      renderImage(g, renderPeepSouth, w * i, h, w, h)
      const renderPeepWest: IRenderFunction = peepRendererFunctionFactory(frameIndexFraction, { ...options, type: "west" })
      renderImage(g, renderPeepWest, w * i, h * 2, w, h)
      const renderPeepNorth: IRenderFunction = peepRendererFunctionFactory(frameIndexFraction, { ...options, type: "north" })
      renderImage(g, renderPeepNorth, w * i, h * 3, w, h)
    }
  }
  renderSpritesheet(scene, key, w * count, h * 4, 32, render)
  // renderCanvas(scene, key, w * count, h, render)
}
