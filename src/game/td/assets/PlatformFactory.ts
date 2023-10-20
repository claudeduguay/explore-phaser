import { IColoring, colorStyle, drawArc2 } from "../../../util/DrawUtil";
import { toRadians } from "../../../util/MathUtil";
import { canvasSize, dimensions, IMarginInsets } from "../../../util/RenderUtil";
import { BOX, IBox, box, scaleBox } from "../../../util/geom/Box";

export type IPlatformType = "box" | "ntagon"
export type ICornerType = "angle" | "curve-o" | "curve-i" | "box-o" | "box-i"

export interface ICorners {
  nw: ICornerType
  ne: ICornerType
  se: ICornerType
  sw: ICornerType
}

export function corners(all: ICornerType): ICorners
export function corners(nw: ICornerType, ne: ICornerType, se: ICornerType, sw: ICornerType): ICorners
export function corners(a: ICornerType, b?: ICornerType, c?: ICornerType, d?: ICornerType): ICorners {
  if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
    return { nw: a, ne: b, se: c, sw: d }
  }
  return { nw: a, ne: a, se: a, sw: a }
}

export interface IPlatformOptions extends IMarginInsets {
  type: IPlatformType
  corners: ICorners
  color: IColoring
  colorBox: IBox
  divisions?: number
}

export const DEFAULT_PLATFORM_OPTIONS: IPlatformOptions = {
  type: "box",
  corners: corners("angle"),
  margin: box(0),
  inset: box(0.2),
  color: ["#CCF", "#336", "#00F"],
  colorBox: BOX.TO_SE
}

function ntagon(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IPlatformOptions) {
  const { color, colorBox } = options
  const { w, h, margin } = dimensions(g, options)
  const div = options.divisions || 0
  const slice = 360.0 / div
  const bounds = scaleBox(colorBox, w, h, false)
  g.fillStyle = colorStyle(g, bounds, color)
  g.beginPath()
  for (let i = 0; i < div; i++) {
    const a = toRadians(slice * i)
    const x = margin.cx + Math.cos(a) * margin.cx
    const y = margin.cy + Math.sin(a) * margin.cy
    if (i === 0) {
      g.moveTo(x, y)
    } else {
      g.lineTo(x, y)
    }
  }
  g.fill()
}

function nwCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const x = margin.x1
  const y = margin.y1
  const ix = inset.x1
  const iy = inset.y1
  switch (corners.nw) {
    case "angle":
      g.lineTo(x + ix, y)
      break
    case "box-i":
      g.lineTo(x + ix, y + ix)
      g.lineTo(x + ix, y)
      break
    case "curve-o":
      drawArc2(g, x + ix, y + iy, ix, iy, 180, 270)
      break
    case "curve-i":
      drawArc2(g, x, y, ix, iy, 90, 0)
      break
    default:
      g.lineTo(x, y)
  }
}

function neCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const y = margin.y1
  const ww = margin.w
  const ix = inset.x1
  const iy = inset.y1
  switch (corners.ne) {
    case "angle":
      g.lineTo(ww, y + iy)
      break
    case "box-i":
      g.lineTo(ww - ix, y + iy)
      g.lineTo(ww, y + iy)
      break
    case "curve-o":
      drawArc2(g, ww - ix, y + iy, ix, iy, 270, 360);
      break
    case "curve-i":
      drawArc2(g, ww, y, ix, iy, 180, 90);
      break
    default:
      g.lineTo(ww, y)
  }
}

function seCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const ww = margin.w
  const hh = margin.h
  const ix = inset.x1
  const iy = inset.y1
  switch (corners.se) {
    case "angle":
      g.lineTo(ww - ix, hh)
      break
    case "box-i":
      g.lineTo(ww - ix, hh - iy)
      g.lineTo(ww - ix, hh)
      break
    case "curve-o":
      drawArc2(g, ww - ix, hh - iy, ix, iy, 0, 90);
      break
    case "curve-i":
      drawArc2(g, ww, hh, ix, iy, 270, 180);
      break
    default:
      g.lineTo(ww, hh)
  }
}

function swCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const x = margin.x1
  const hh = margin.h
  const ix = inset.x1
  const iy = inset.y1
  switch (corners.sw) {
    case "angle":
      g.lineTo(x, hh - iy)
      break
    case "box-i":
      g.lineTo(x + ix, hh - iy)
      g.lineTo(x, hh - iy)
      break
    case "curve-o":
      drawArc2(g, x + ix, hh - iy, ix, iy, 90, 180);
      break
    case "curve-i":
      drawArc2(g, x, hh, ix, iy, 360, 270);
      break
    default:
      g.lineTo(x, hh)
  }
}

export function baseRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IPlatformOptions
) {
  const { color, colorBox } = options
  const { w, h, margin, inset } = dimensions(g, options)
  const x = margin.x1
  const y = margin.y1
  const ww = margin.w
  const hh = margin.h
  const i = inset.x1
  const bounds = scaleBox(colorBox, w, h, false)
  g.fillStyle = colorStyle(g, bounds, color)
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
