import { Tweens, Math as PMath } from "phaser";
import { canvasSize } from "../../../util/RenderUtil";
import { IRGBA, colorToRGBA, setPixel } from "../../../util/PixelUtil";
import { IEasingFunction, IEasingKeyOrFunction, IInterpolationFunction, IInterpolationKeyOrFunction } from "../../../util/Interpolation";

/* 

Notes:

Radial (corner) interpolation means angle between sides interpolation, with inset fraction matching
since edges may not have the same width. So half way through the angle range will produce a value
at radius fraction between start and end sides.

4-Way interpolation for the center could be more tricky. It may be OK to interpolate vertically first
and then horizontally. That is, left and right edges are interpolated first and the horizontal value
between those.

*/

export interface IMargins {
  north: number
  south: number
  west: number
  east: number
}

export interface IColors {
  north: Array<number | IRGBA>
  south: Array<number | IRGBA>
  west: Array<number | IRGBA>
  east: Array<number | IRGBA>
}

export interface IColorsRGBA {
  north: Array<IRGBA>
  south: Array<IRGBA>
  west: Array<IRGBA>
  east: Array<IRGBA>
}

export interface INineSliceOptions {
  margin: number | IMargins
  color: Array<number | IRGBA> | IColors
  easing: IEasingKeyOrFunction
  interpolation: IInterpolationKeyOrFunction
}

export const DEFAULT_NINE_SLICE_OPTIONS: INineSliceOptions = {
  margin: 0.1,
  color: {
    north: [0xFFFFFFFFF, 0x0000FFFF],
    west: [0xFFFFFFFF, 0x00FF00FF],
    south: [0x000000FF, 0x660000FF],
    east: [0x0000000FF, 0xFF8800FF],
  },
  easing: "Sine.easeOut",
  interpolation: "linear"
}

export function asMargins(m: number | IMargins): IMargins {
  if (typeof m === "number") {
    return { north: m, south: m, west: m, east: m }
  }
  return m
}

export function scaleMargins(margins: IMargins, w: number, h: number) {
  return {
    north: margins.north * h,
    south: margins.south * h,
    west: margins.west * w,
    east: margins.east * w
  }
}

export function asRGBAArray(array: Array<number | IRGBA>, alpha?: number): IRGBA[] {
  return array.map(v => {
    if (typeof v === "number") {
      return colorToRGBA(v, true)
    }
    return v
  })
}

export function asColors(c: Array<number | IRGBA> | IColors): IColorsRGBA {
  if (Array.isArray(c)) {
    return {
      north: asRGBAArray(c, 1.0),
      south: asRGBAArray(c, 1.0),
      west: asRGBAArray(c, 1.0),
      east: asRGBAArray(c, 1.0)
    }
  }
  return {
    north: asRGBAArray(c.north, 1.0),
    south: asRGBAArray(c.south, 1.0),
    west: asRGBAArray(c.west, 1.0),
    east: asRGBAArray(c.east, 1.0)
  }
}

export function interpolateRGBA(rgba: Array<IRGBA>, f: number, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
  return {
    r: interpolationFunction(rgba.map(v => v.r), easingFunction(f)),
    g: interpolationFunction(rgba.map(v => v.g), easingFunction(f)),
    b: interpolationFunction(rgba.map(v => v.b), easingFunction(f)),
    a: interpolationFunction(rgba.map(v => v.a), easingFunction(f)),
  }
}

export function nineSliceRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: INineSliceOptions) {
  const { margin, color, easing, interpolation } = options
  const { w, h } = canvasSize(g)
  const margins = scaleMargins(asMargins(margin), w, h)
  const colors = asColors(color)
  const easingFunction = Tweens.Builders.GetEaseFunction(easing) as IEasingFunction
  const interpolationFunction = (Tweens.Builders.GetInterpolationFunction(interpolation) ||
    PMath.Interpolation.Linear) as IInterpolationFunction
  const imageData = g.getImageData(0, 0, w, h)
  renderWestSide(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  renderEastSide(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  renderNorthSide(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  renderSouthSide(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  renderNorthWestCorner(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  // renderNorthEastCorner(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  // renderSouthWestCorner(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  // renderSouthEastCorner(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  renderCenter(imageData, w, h, margins, colors, easingFunction, interpolationFunction)
  g.putImageData(imageData, 0, 0)
}

export function renderWestSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
  for (let x = 0; x < margins.west; x++) {
    const f = x / margins.west
    const c = interpolateRGBA(colors.west, f, easingFunction, interpolationFunction)
    for (let y = margins.north; y < h - margins.south; y++) {
      setPixel(imageData, x, y, c, true)
    }
  }
}

export function renderEastSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
  for (let x = 0; x < margins.east; x++) {
    const f = x / margins.east
    const c = interpolateRGBA(colors.east, f, easingFunction, interpolationFunction)
    for (let y = margins.north; y < h - margins.south; y++) {
      setPixel(imageData, w - x, y, c, true)
    }
  }
}

export function renderNorthSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
  for (let y = 0; y < margins.north; y++) {
    const f = y / margins.north
    const c = interpolateRGBA(colors.north, f, easingFunction, interpolationFunction)
    for (let x = margins.west; x < w - margins.east; x++) {
      setPixel(imageData, x, y, c, true)
    }
  }
}

export function renderSouthSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
  for (let y = 0; y < margins.south; y++) {
    const f = y / margins.south
    const c = interpolateRGBA(colors.south, f, easingFunction, interpolationFunction)
    for (let x = margins.west; x < w - margins.east; x++) {
      setPixel(imageData, x, h - y, c, true)
    }
  }
}

// Not quite right yet
export function renderNorthWestCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
  for (let y = 0; y < margins.north; y++) {
    const vf = y / margins.north
    const north = interpolateRGBA(colors.north, vf, easingFunction, interpolationFunction)
    for (let x = 0; x < margins.west; x++) {
      const hf = x / margins.west
      const west = interpolateRGBA(colors.west, hf, easingFunction, interpolationFunction)
      // const r = Math.sqrt(Math.pow(margins.north, 2) + Math.pow(margins.east, 2))
      const f = Math.atan2(y, x) % (Math.PI / 2) / (Math.PI / 2)
      const c = interpolateRGBA([north, west], f, easingFunction, interpolationFunction)
      setPixel(imageData, x, y, c, true)
    }
  }
}

export function renderNorthEastCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
}

export function renderSouthWestCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
}

export function renderSouthEastCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
}

export function renderCenter(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction) {
  for (let y = 0; y <= (h - (margins.north + margins.south)); y++) {
    const vf = y / (h - (margins.north + margins.south))
    const vert = interpolateRGBA([colors.north[1], colors.south[1]], vf, easingFunction, interpolationFunction)
    for (let x = 0; x <= (w - (margins.west + margins.east)); x++) {
      const f = x / (w - (margins.west + margins.east))
      const horz = interpolateRGBA([colors.west[1], colors.east[1]], f, easingFunction, interpolationFunction)
      const c = interpolateRGBA([horz, vert], f, easingFunction, interpolationFunction)
      setPixel(imageData, x + margins.west, y + margins.north, c, true)
    }
  }
}

export function nineSliceRendererFunctionFactory(
  frameIndexFraction: number,
  options: Partial<INineSliceOptions> = DEFAULT_NINE_SLICE_OPTIONS
) {
  const merged = { ...DEFAULT_NINE_SLICE_OPTIONS, ...options }
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    nineSliceRenderer(g, frameIndexFraction, merged)
  }
}