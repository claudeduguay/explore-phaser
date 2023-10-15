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

export const LINEAR_EASING = PMath.Easing.Linear
export const LINEAR_INTERPOLATOR = PMath.Interpolation.Linear

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

export function asRGBAArray(array: Array<number | IRGBA>): IRGBA[] {
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
      north: asRGBAArray(c),
      south: asRGBAArray(c),
      west: asRGBAArray(c),
      east: asRGBAArray(c)
    }
  }
  return {
    north: asRGBAArray(c.north),
    south: asRGBAArray(c.south),
    west: asRGBAArray(c.west),
    east: asRGBAArray(c.east)
  }
}

export function makeInterpolator(easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction): IInterpolationFunction {
  return (values: Array<number>, f: number) => interpolationFunction(values, easingFunction(f))
}

export type IInterpolateRGBA = (rgba: Array<IRGBA>, f: number) => IRGBA

export function makeRGBAInterpolator(interpolator: IInterpolationFunction): IInterpolateRGBA {
  return (rgba: Array<IRGBA>, f: number) => ({
    r: interpolator(rgba.map(v => v.r), f),
    g: interpolator(rgba.map(v => v.g), f),
    b: interpolator(rgba.map(v => v.b), f),
    a: interpolator(rgba.map(v => v.a), f),
  })
}

export function makeInterpolateRGBA(easingFunction: IEasingFunction, interpolationFunction: IInterpolationFunction): IInterpolateRGBA {
  return makeRGBAInterpolator(makeInterpolator(easingFunction, interpolationFunction))
}

export const lerpRGBA: IInterpolateRGBA = makeRGBAInterpolator(LINEAR_INTERPOLATOR)

export function nineSliceRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: INineSliceOptions) {
  const { margin, color, easing, interpolation } = options
  const { w, h } = canvasSize(g)
  const margins = scaleMargins(asMargins(margin), w, h)
  const colors = asColors(color)
  const easingFunction = Tweens.Builders.GetEaseFunction(easing) as IEasingFunction
  const interpolationFunction = (Tweens.Builders.GetInterpolationFunction(interpolation) || LINEAR_INTERPOLATOR) as IInterpolationFunction
  const interpolateRGBA = makeInterpolateRGBA(easingFunction, interpolationFunction)

  const imageData = g.getImageData(0, 0, w, h)
  renderWestSide(imageData, w, h, margins, colors, interpolateRGBA)
  renderEastSide(imageData, w, h, margins, colors, interpolateRGBA)
  renderNorthSide(imageData, w, h, margins, colors, interpolateRGBA)
  renderSouthSide(imageData, w, h, margins, colors, interpolateRGBA)
  renderNorthWestCorner(imageData, w, h, margins, colors, interpolateRGBA)
  // renderNorthEastCorner(imageData, w, h, margins, colors, interpolateRGBA)
  // renderSouthWestCorner(imageData, w, h, margins, colors, interpolateRGBA)
  // renderSouthEastCorner(imageData, w, h, margins, colors, interpolateRGBA)
  renderCenter(imageData, w, h, margins, colors, interpolateRGBA)
  g.putImageData(imageData, 0, 0)
}

// Not widely used yet but shows promise for simplification
// Using in renderWestSide so far
export function* range(min: number, max: number) {
  const range = max - min
  for (let i = min; i < max; i++) {
    yield { i, f: i / range }
  }
}

export function renderWestSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
  for (let { i: x, f } of range(0, margins.west)) {
    const c = interpolateRGBA(colors.west, f)
    for (let { i: y } of range(margins.north, h - margins.south)) {
      setPixel(imageData, x, y, c, true)
    }
  }
}

export function renderEastSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
  for (let x = 0; x < margins.east; x++) {
    const f = x / margins.east
    const c = interpolateRGBA(colors.east, f)
    for (let y = margins.north; y < h - margins.south; y++) {
      setPixel(imageData, w - x, y, c, true)
    }
  }
}

export function renderNorthSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
  for (let y = 0; y < margins.north; y++) {
    const f = y / margins.north
    const c = interpolateRGBA(colors.north, f)
    for (let x = margins.west; x < w - margins.east; x++) {
      setPixel(imageData, x, y, c, true)
    }
  }
}

export function renderSouthSide(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
  for (let y = 0; y < margins.south; y++) {
    const f = y / margins.south
    const c = interpolateRGBA(colors.south, f)
    for (let x = margins.west; x < w - margins.east; x++) {
      setPixel(imageData, x, h - y, c, true)
    }
  }
}

// Not quite right yet
export function renderNorthWestCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
  for (let { i: y, f: yf } of range(0, margins.north)) {
    const north = interpolateRGBA(colors.north, yf)
    for (let { i: x, f: xf } of range(0, margins.west)) {
      const west = interpolateRGBA(colors.west, xf)
      // const r = Math.sqrt(Math.pow(margins.north, 2) + Math.pow(margins.east, 2))
      const f = Math.atan2(y, x) % (Math.PI / 2) / (Math.PI / 2)
      const c = lerpRGBA([north, west], f)
      setPixel(imageData, x, y, c, true)
    }
  }
}

export function renderNorthEastCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
}

export function renderSouthWestCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
}

export function renderSouthEastCorner(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
}

export function renderCenter(imageData: ImageData, w: number, h: number, margins: IMargins, colors: IColorsRGBA, interpolateRGBA: IInterpolateRGBA) {
  for (let { i: y, f: yf } of range(0, h - (margins.north + margins.south) + 1)) {
    const vert = lerpRGBA([colors.north[1], colors.south[1]], yf)
    for (let { i: x, f: xf } of range(0, w - (margins.west + margins.east) + 1)) {
      const horz = lerpRGBA([colors.west[1], colors.east[1]], xf)
      const c = lerpRGBA([horz, vert], 0.5)
      setPixel(imageData, margins.west + x, margins.north + y, c, true)
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