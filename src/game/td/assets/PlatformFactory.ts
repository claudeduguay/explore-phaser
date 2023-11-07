import { Math as PMath } from "phaser";
import { IColoring, colorStyle, drawArc2 } from "../../../util/DrawUtil";
import { lerp, toRadians } from "../../../util/MathUtil";
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
export function corners(dr: ICornerType, dl: ICornerType): ICorners
export function corners(nw: ICornerType, ne: ICornerType, se: ICornerType, sw: ICornerType): ICorners
export function corners(a: ICornerType, b?: ICornerType, c?: ICornerType, d?: ICornerType): ICorners {
  if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
    return { nw: a, ne: b, se: c, sw: d }
  }
  else if (a !== undefined && b !== undefined) {
    return { nw: a, ne: b, se: a, sw: b }
  }
  return { nw: a, ne: a, se: a, sw: a }
}

export type IInterpolator = (f: number) => number

const CURVES: Record<string, IInterpolator> = {
  // "line" is wasteful since we draw 10 lines but only happens at texture creation
  line: (f: number) => 0,
  curve: (f: number) => Math.sin(Math.PI * f),
  groove: (f: number) => f > 0.5 ? (1.0 - f) * 2 : f * 2,
  spike: (f: number) => PMath.Interpolation.Linear([0, 1, 1, 0, 1, 1, 0], f),
  wave: (f: number) => PMath.Interpolation.CatmullRom([0, 1, 0, 1, 0], f)
}

export type IEdgeType = keyof typeof CURVES

export interface IEdges {
  north: IEdgeType
  south: IEdgeType
  east: IEdgeType
  west: IEdgeType
}

export function edges(all: IEdgeType): IEdges
export function edges(horz: IEdgeType, vert: IEdgeType): IEdges
export function edges(north: IEdgeType, south: IEdgeType, east: IEdgeType, west: IEdgeType): IEdges
export function edges(a: IEdgeType, b?: IEdgeType, c?: IEdgeType, d?: IEdgeType): IEdges {
  if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
    return { north: a, south: b, east: c, west: d }
  }
  else if (a !== undefined && b !== undefined) {
    return { north: a, south: a, east: b, west: b }
  }
  return { north: a, south: a, east: a, west: a }
}

export interface IPlatformOptions extends IMarginInsets {
  type: IPlatformType
  corners: ICorners
  edges: IEdges
  color: IColoring
  colorBox: IBox
  divisions?: number
  lineWidth: number
  line?: string
}

export const DEFAULT_PLATFORM_OPTIONS: IPlatformOptions = {
  type: "box",
  corners: corners("angle"),
  edges: edges("wave"),
  margin: box(0),
  inset: box(0.2),
  color: ["#CCF", "#336", "#00F"],
  colorBox: BOX.TO_SE,
  divisions: 8,
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
  g.closePath()
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


// Interpolates curve across X or Y (vert or horz) from start to end with a given offset and variance
function drawCurve(g: CanvasRenderingContext2D,
  start: number, end: number,
  offset: number, variance: number,
  dir: "vert" | "horz",
  interpolator: IInterpolator) {
  const n = 20
  for (let i = 0; i <= n; i++) {
    let xx = offset + interpolator(i / n) * variance
    let yy = lerp(start, end, i / n)
    if (dir === "horz") {
      xx = lerp(start, end, i / n)
      yy = offset + interpolator(i / n) * variance
    }
    g.lineTo(xx, yy)
  }
}

function northEdge(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { edges } = options
  const { margin, inset } = dimensions(g, options)
  const x = margin.x1
  const y = margin.y1
  const ww = margin.w
  const { x1, x2 } = inset
  drawCurve(g, x + x1, ww - x2, y, x1 / 2, "horz", CURVES[edges.north])
}

function southEdge(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { edges } = options
  const { margin, inset } = dimensions(g, options)
  const x = margin.x1
  const ww = margin.w
  const hh = margin.h
  const { x1, x2 } = inset
  drawCurve(g, ww - x2, x + x1, hh, -x1 / 2, "horz", CURVES[edges.south])
}

function eastEdge(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { edges } = options
  const { margin, inset } = dimensions(g, options)
  const y = margin.y1
  const ww = margin.w
  const hh = margin.h
  const { x2, y1, y2 } = inset
  drawCurve(g, y + y1, hh - y2, ww, -x2 / 2, "vert", CURVES[edges.east])
}

function westEdge(g: CanvasRenderingContext2D, options: IPlatformOptions) {
  const { edges } = options
  const { margin, inset } = dimensions(g, options)
  const x = margin.x1
  const y = margin.y1
  const hh = margin.h
  const { x1, y1, y2 } = inset
  drawCurve(g, hh - y2, y + y1, x, x1 / 2, "vert", CURVES[edges.west])
}

export function baseRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IPlatformOptions
) {
  const { color, colorBox, line, lineWidth } = options
  const { w, h, margin, inset } = dimensions(g, options)
  const x = margin.x1
  const y = margin.y1
  // const ww = margin.w
  // const hh = margin.h
  const i = inset.x1
  const bounds = scaleBox(colorBox, w, h)
  g.fillStyle = colorStyle(g, bounds, color)
  g.beginPath()
  g.moveTo(x, y + i)
  nwCorner(g, options)
  northEdge(g, options)
  neCorner(g, options)
  eastEdge(g, options)
  // g.lineTo(ww, hh - i)
  seCorner(g, options)
  southEdge(g, options)
  // g.lineTo(x + i, hh)
  swCorner(g, options)
  westEdge(g, options)
  // g.lineTo(x, y + i)
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
