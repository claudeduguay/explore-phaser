import { distributedStops, drawArc, linearGradient } from "./util/DrawUtil";
import { canvasSize } from "./util/RenderUtil";

export type IPlatformType = "angle" | "curve-o" | "curve-i" | "box-o" | "box-i"

export interface IPlatformOptions {
  type: IPlatformType;
  margin: number;
  inset: number;
  gradient: string[]
}

export const DEFAULT_PLATFORM_OPTIONS: IPlatformOptions = {
  type: "curve-o",
  margin: 0,
  inset: 0.2,
  gradient: ["#CCF", "#336", "#00F"]
}

function nwCorner(g: CanvasRenderingContext2D, { type, margin, inset }: IPlatformOptions) {
  const { w, h } = canvasSize(g)
  const x = margin * w
  const y = margin * h
  const ww = w - (x * 2)
  const i = inset * ww
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

function neCorner(g: CanvasRenderingContext2D, { type, margin, inset }: IPlatformOptions) {
  const { w, h } = canvasSize(g)
  const x = margin * w
  const y = margin * h
  const ww = w - (x * 2)
  const i = inset * ww
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

function seCorner(g: CanvasRenderingContext2D, { type, margin, inset }: IPlatformOptions) {
  const { w, h } = canvasSize(g)
  const x = margin * w
  const y = margin * h
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const i = inset * ww
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

function swCorner(g: CanvasRenderingContext2D, { type, margin, inset }: IPlatformOptions) {
  const { w, h } = canvasSize(g)
  const x = margin * w
  const y = margin * h
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const i = inset * ww
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
  const { margin, inset, gradient } = options
  const { w, h } = canvasSize(g)
  const x = margin * w
  const y = margin * h
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const i = inset * ww
  g.fillStyle = linearGradient(g, x, y, ww, hh, ...distributedStops(gradient))
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
  g.fill()
}

export function platformRendererFunctionFactory(
  frameIndexFraction: number,
  options: IPlatformOptions = DEFAULT_PLATFORM_OPTIONS
) {
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    baseRenderer(g, frameIndexFraction, options)
  };
}
