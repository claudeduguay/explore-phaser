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
  lineWidth: number
  line?: string
}

export const DEFAULT_PLATFORM_OPTIONS: IPlatformOptions = {
  type: "box",
  corners: corners("angle"),
  margin: box(0),
  inset: box(0.2),
  color: ["#CCF", "#336", "#00F"],
  colorBox: BOX.TO_SE,
  lineWidth: 1
}

function ntagon(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IPlatformOptions) {
  const { color, colorBox, line, lineWidth } = options
  const { w, h, margin } = dimensions(g, options)
  const div = options.divisions || 0
  const slice = 360.0 / div
  const bounds = scaleBox(colorBox, w, h)
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
  if (line) {
    g.lineWidth = lineWidth
    g.strokeStyle = line
    g.stroke()
  }
}

function nwCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const { x1, y1 } = margin
  const { x1: ix, y1: iy } = inset
  switch (corners.nw) {
    case "angle":
      g.lineTo(x1 + ix, y1)
      break
    case "box-i":
      g.lineTo(x1 + ix, y1 + ix)
      g.lineTo(x1 + ix, y1)
      break
    case "curve-o":
      drawArc2(g, x1 + ix, y1 + iy, ix, iy, 180, 270)
      break
    case "curve-i":
      drawArc2(g, x1, y1, ix, iy, 90, 0)
      break
    default:
      g.lineTo(x1, y1)
  }
}

function neCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const { y1, r } = margin
  const { x1: ix, y2: iy } = inset
  switch (corners.ne) {
    case "angle":
      g.lineTo(r, y1 + iy)
      break
    case "box-i":
      g.lineTo(r - ix, y1 + iy)
      g.lineTo(r, y1 + iy)
      break
    case "curve-o":
      drawArc2(g, r - ix, y1 + iy, ix, iy, 270, 360);
      break
    case "curve-i":
      drawArc2(g, r, y1, ix, iy, 180, 90);
      break
    default:
      g.lineTo(r, y1)
  }
}

function seCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const { r, b } = margin
  const { x2: ix, y2: iy } = inset
  switch (corners.se) {
    case "angle":
      g.lineTo(r - ix, b)
      break
    case "box-i":
      g.lineTo(r - ix, b - iy)
      g.lineTo(r - ix, b)
      break
    case "curve-o":
      drawArc2(g, r - ix, b - iy, ix, iy, 0, 90);
      break
    case "curve-i":
      drawArc2(g, r, b, ix, iy, 270, 180);
      break
    default:
      g.lineTo(r, b)
  }
}

function swCorner(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { corners } = options
  const { margin, inset } = dimensions(g, options)
  const { x1, b } = margin
  const { x1: ix, y2: iy } = inset
  switch (corners.sw) {
    case "angle":
      g.lineTo(x1, b - iy)
      break
    case "box-i":
      g.lineTo(x1 + ix, b - iy)
      g.lineTo(x1, b - iy)
      break
    case "curve-o":
      drawArc2(g, x1 + ix, b - iy, ix, iy, 90, 180);
      break
    case "curve-i":
      drawArc2(g, x1, b, ix, iy, 360, 270);
      break
    default:
      g.lineTo(x1, b)
  }
}

export function baseRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IPlatformOptions
) {
  const { color, colorBox, line, lineWidth } = options
  const { w, h, margin, inset } = dimensions(g, options)
  const x = margin.x1
  const y = margin.y1
  const ww = margin.w
  const hh = margin.h
  const i = inset.x1
  const bounds = scaleBox(colorBox, w, h)
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
  if (line) {
    g.lineWidth = lineWidth
    g.strokeStyle = line
    g.stroke()
  }
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
