import { Tweens, Math as PMath } from "phaser";
import { IColoring } from "../../../util/DrawUtil";
import { canvasSize } from "../../../util/RenderUtil";
import { rgbaToColor, setPixel } from "../../../util/PixelUtil";

export interface IMargins {
  north: number
  south: number
  west: number
  east: number
}

export interface INineSliceOptions {
  margin: number | IMargins
  color: IColoring
  easing: string
}

export const DEFAULT_NINE_SLICE_OPTIONS: INineSliceOptions = {
  margin: 0.1,
  color: ["#00F"],
  easing: PMath.Easing.Quadratic.Out.name // PMath.Easing.Linear.name
}

export function nineSliceRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: INineSliceOptions) {
  console.log("Rendering Nine Slice")
  const { margin, easing } = options
  const { w, h } = canvasSize(g)
  let marginStruct
  if (typeof margin === "number") {
    marginStruct = { north: margin, south: margin, west: margin, east: margin }
  } else {
    marginStruct = margin
  }
  const easingFunction = Tweens.Builders.GetEaseFunction(easing)
  const value = easingFunction(0.5)
  console.log("Easing:", easing, easingFunction, value) //  Seems to be lnear
  const margins = {
    left: marginStruct.west * w,
    right: w - marginStruct.east * w,
    top: marginStruct.north * h,
    bottom: h - marginStruct.south * h,
  }
  console.log("Marings:", margins)
  const imageData = g.getImageData(0, 0, w, h)
  // Left/Right sides
  for (let y = margins.top; y < margins.bottom; y++) {
    // Left side
    const westWidth = marginStruct.west * w
    for (let x = 0; x < westWidth; x++) {
      const f = x / westWidth
      const value = easingFunction(f)
      // console.log("Fraction:", f, value) //  Seems to be lnear
      const pixel = rgbaToColor({ r: value, g: value, b: value, a: 1.0 }, true)
      setPixel(imageData, x, y, pixel)
    }
    // Right side
    const eastWidth = marginStruct.east * w
    for (let x = 0; x < eastWidth; x++) {
      const f = 1.0 - x / eastWidth
      const value = easingFunction(f)
      // console.log("Fraction:", f, value) //  Seems to be lnear
      const pixel = rgbaToColor({ r: value, g: value, b: value, a: 1.0 }, true)
      setPixel(imageData, w - x, y, pixel)
    }
  }
  g.putImageData(imageData, 0, 0)
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