import { lerpInt } from "../../../util/MathUtil";
import { IMarginInsets, canvasSize } from "../../../util/RenderUtil";

export type ILandscapeType = "sand" | "grass" | "hills" | "mountain"

export interface ILandscapeOptions extends IMarginInsets {
  type: ILandscapeType
}

export const DEFAULT_LANDSCAPE_OPTIONS: ILandscapeOptions = {
  type: "grass",
  margin: 0,
  inset: 0
}

export function baseRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: ILandscapeOptions) {
  const { type } = options
  switch (type) {
    case "grass":
      grassRenderer(g, frameIndexFraction, options)
      return
    default:
      grassRenderer(g, frameIndexFraction, options)
  }
}

export function grassRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: ILandscapeOptions) {
  const { w, h } = canvasSize(g)
  g.globalAlpha = 1.0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const green = lerpInt(0x99, 0xFF, Math.random()).toString(16).toUpperCase()
      const color = `#00${green}00`
      // console.log("Grass color:", color)
      g.fillStyle = color
      g.fillRect(x, y, 1, 1)
    }
  }
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
  };
}
