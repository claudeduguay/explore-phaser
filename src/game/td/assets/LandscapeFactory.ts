import { Math as PMath } from "phaser"
import { IRGBA, colorToRGBA, setPixel } from "../../../util/PixelUtil";
import { IMarginInsets, canvasSize } from "../../../util/RenderUtil";
import { box } from "../../../util/geom/Box";

export type ILandscapeType = "grass" | "water" | "snow" | "sand" | "hill" | "mountain"

export interface ILandscapeOptions extends IMarginInsets {
  type: ILandscapeType
}

export const DEFAULT_LANDSCAPE_OPTIONS: ILandscapeOptions = {
  type: "grass",
  margin: box(0),
  inset: box(0),
}

export interface ISpread {
  r: number[],
  g: number[],
  b: number[],
  a: number[],
}

export const COLOR_RANGES: Record<string, ISpread> = {
  "grass": spreadToRGBA([0x009900, 0x00CC00]),
  "water": spreadToRGBA([0x666699, 0x9999FF]),
  "snow": spreadToRGBA([0xCCCCCC, 0xFFFFFF]),
  "sand": spreadToRGBA([0xCCCC66, 0xCCAA99])
}

export function spreadToRGBA(colorRange: number[]): ISpread {
  const colors = colorRange.map(c => colorToRGBA(c << 8, true))
  return {
    r: colors.map(c => c.r),
    g: colors.map(c => c.g),
    b: colors.map(c => c.b),
    a: colors.map(c => 1)
  }
}

export function randomSpreadColor(colorSpead: ISpread): IRGBA {
  return {
    r: PMath.Interpolation.Linear(colorSpead.r, Math.random()),
    g: PMath.Interpolation.Linear(colorSpead.g, Math.random()),
    b: PMath.Interpolation.Linear(colorSpead.b, Math.random()),
    a: PMath.Interpolation.Linear(colorSpead.a, Math.random())
  }
}

export function baseRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: ILandscapeOptions) {
  const { type } = options
  switch (type) {
    case "grass":
      colorSpreadRenderer(g, frameIndexFraction, options)
      return
    default:
      colorSpreadRenderer(g, frameIndexFraction, options)
  }
}

export function colorSpreadRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: ILandscapeOptions) {
  const imageData = g.getImageData(0, 0, g.canvas.width, g.canvas.height)
  const { w, h } = canvasSize(g)
  const colorSpread = COLOR_RANGES[options.type]
  g.globalAlpha = 1.0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = randomSpreadColor(colorSpread)
      setPixel(imageData, x, y, color, true)
    }
  }
  g.putImageData(imageData, 0, 0)
}

export function landscapeRendererFunctionFactory(
  frameIndexFraction: number,
  options: Partial<ILandscapeOptions> = DEFAULT_LANDSCAPE_OPTIONS
) {
  const merged = { ...DEFAULT_LANDSCAPE_OPTIONS, ...options }
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    baseRenderer(g, frameIndexFraction, merged)
  }
}
