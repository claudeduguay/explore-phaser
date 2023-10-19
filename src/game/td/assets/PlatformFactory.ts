import { IColoring, colorStyle, drawArc } from "../../../util/DrawUtil";
import { toRadians } from "../../../util/MathUtil";
import { canvasSize, dimensions, IMarginInsets } from "../../../util/RenderUtil";
import { box } from "../../../util/geom/Box";

export type IPlatformType = "angle" | "curve-o" | "curve-i" | "box-o" | "box-i" | "ntagon"

export interface IPlatformOptions extends IMarginInsets {
  type: IPlatformType;
  color: IColoring
  divisions?: number
}

export const DEFAULT_PLATFORM_OPTIONS: IPlatformOptions = {
  type: "curve-o",
  margin: box(0),
  inset: box(0.2),
  color: ["#CCF", "#336", "#00F"]
}

function ntagon(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IPlatformOptions) {
  const { margin, color } = options
  const { w, h } = dimensions(g, options)
  const x = margin.x1 * w
  const y = margin.y1 * h
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const cx = x + ww / 2
  const cy = y + hh / 2
  // const i = inset * ww
  const div = options.divisions || 0
  const slice = 360.0 / div
  g.fillStyle = colorStyle(g, { x1: x, y1: y, x2: ww, y2: hh }, color)
  g.beginPath()
  for (let i = 0; i < div; i++) {
    const a = toRadians(slice * i)
    const x = cx + Math.cos(a) * cx
    const y = cy + Math.sin(a) * cy
    if (i === 0) {
      g.moveTo(x, y)
    } else {
      g.lineTo(x, y)
    }
  }
  g.fill()
}

function nwCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { type, margin, inset } = options
  const { w, h } = dimensions(g, options)
  const x = margin.x1 * w
  const y = margin.y1 * h
  const ww = w - (x * 2)
  const i = inset.x1 * ww
  switch (type) {
    case "angle":
      g.lineTo(x + i, y)
      break
    case "box-i":
      g.lineTo(x + i, y + i)
      g.lineTo(x + i, y)
      break
    case "curve-o":
      drawArc(g, x + i, y + i, i, 180, 270);
      break
    case "curve-i":
      drawArc(g, x, y, i, 90, 0);
      break
    default:
      g.lineTo(x, y)
  }
}

function neCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { type, margin, inset } = options
  const { w, h } = dimensions(g, options)
  const x = margin.x1 * w
  const y = margin.y1 * h
  const ww = w - (x * 2)
  const i = inset.x1 * ww
  switch (type) {
    case "angle":
      g.lineTo(ww, y + i)
      break
    case "box-i":
      g.lineTo(ww - i, y + i)
      g.lineTo(ww, y + i)
      break
    case "curve-o":
      drawArc(g, ww - i, y + i, i, 270, 360);
      break
    case "curve-i":
      drawArc(g, ww, y, i, 180, 90);
      break
    default:
      g.lineTo(ww, y)
  }
}

function seCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { type, margin, inset } = options
  const { w, h } = dimensions(g, options)
  const x = margin.x1 * w
  const y = margin.y1 * h
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const i = inset.x1 * ww
  switch (type) {
    case "angle":
      g.lineTo(ww - i, hh)
      break
    case "box-i":
      g.lineTo(ww - i, hh - i)
      g.lineTo(ww - i, hh)
      break
    case "curve-o":
      drawArc(g, ww - i, hh - i, i, 0, 90);
      break
    case "curve-i":
      drawArc(g, ww, hh, i, 270, 180);
      break
    default:
      g.lineTo(ww, hh)
  }
}

function swCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { type, margin, inset } = options
  const { w, h } = dimensions(g, options)
  const x = margin.x1 * w
  const y = margin.y1 * h
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const i = inset.x1 * ww
  switch (type) {
    case "angle":
      g.lineTo(x, hh - i)
      break
    case "box-i":
      g.lineTo(x + i, hh - i)
      g.lineTo(x, hh - i)
      break
    case "curve-o":
      drawArc(g, x + i, hh - i, i, 90, 180);
      break
    case "curve-i":
      drawArc(g, x, hh, i, 360, 270);
      break
    default:
      g.lineTo(x, hh)
  }
}

export function baseRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IPlatformOptions
) {
  const { margin, inset, color } = options
  const { w, h } = dimensions(g, options)
  const x = margin.x1 * w
  const y = margin.y1 * h
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const i = inset.x1 * ww
  g.fillStyle = colorStyle(g, { x1: x, y1: y, x2: ww, y2: hh }, color)
  g.beginPath()
  g.moveTo(x, y + i)
  nwCorner(g, options)
  g.lineTo(ww - i, y)
  neCorner(g, options)
  g.lineTo(ww, hh - i)
  seCorner(g, options)
  g.lineTo(x + i, hh)
  swCorner(g, options)
  g.lineTo(x, y + i)
  g.closePath()
  g.fill()
}

export function platformRendererFunctionFactory(
  frameIndexFraction: number,
  options: Partial<IPlatformOptions> = DEFAULT_PLATFORM_OPTIONS
) {
  const merged = { ...DEFAULT_PLATFORM_OPTIONS, ...options }
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    if (options.type === "ntagon") {
      ntagon(g, frameIndexFraction, merged)
    } else {
      baseRenderer(g, frameIndexFraction, merged)
    }
  }
}
