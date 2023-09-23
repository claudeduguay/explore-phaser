import { distributedStops, linearGradient } from "./util/DrawUtil";
import { toRadians } from "./util/MathUtil";
import { canvasSize } from "./util/RenderUtil";

export type ITurretType = "convex" | "concave"

export interface ITurretOptions {
  type: ITurretType;
  margin: number;
  inset: number;
  ratio: number;
  topSeg: number;
  botSeg: number;
  gradient: string[]
  line: string
}

export const DEFAULT_TURRET_OPTIONS: ITurretOptions = {
  type: "convex",
  margin: 0,
  inset: 0.1,
  ratio: 0.66,
  topSeg: 7,
  botSeg: 10,
  gradient: ["#99F", "#00F", "#009"],
  line: "white"
}

export function drawPolylipse(g: CanvasRenderingContext2D,
  cx: number = 0, cy: number = 0,
  rx: number = 100, ry: number = 100,
  startAngle: number = 0, endAngle: number = 360,
  segments: number = 30, append: boolean = false) {
  const step = Math.abs(endAngle - startAngle) / segments
  function addPoint(a: number) {
    const x = cx + Math.sin(toRadians(a + 90)) * rx
    const y = cy + Math.cos(toRadians(a + 90)) * ry
    if (!append && a === startAngle) {
      g.moveTo(x, y)
    } else {
      g.lineTo(x, y)
    }

  }
  if (endAngle > startAngle) {
    for (let a = startAngle; a <= endAngle; a += step) {
      addPoint(a)
    }
  } else {
    for (let a = startAngle; a >= endAngle; a -= step) {
      addPoint(a)
    }
  }
}

export function turretRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: ITurretOptions) {
  const { type, margin, inset, ratio, topSeg, botSeg, gradient, line } = options
  const { w, h } = canvasSize(g)
  const x = w * margin
  const y = h * margin
  const ww = w - (x * 2)
  const hh = h - (y * 2)

  const mid = { x: ww / 2 - inset, y: hh * ratio - inset }
  const tr = hh * ratio - inset
  const br = hh * (1.0 - ratio) - inset

  g.fillStyle = linearGradient(g, x, y, ww, hh, ...distributedStops(gradient))
  g.strokeStyle = line
  g.lineWidth = 2

  g.beginPath()
  drawPolylipse(g, mid.x, mid.y, mid.x, tr, 0, 180, topSeg)
  if (type === "concave") {
    drawPolylipse(g, mid.x, mid.y, mid.x, br, 180, 0, botSeg, true)
  } else {
    drawPolylipse(g, mid.x, mid.y, mid.x, br, 180, 360, botSeg, true)
  }
  g.closePath()

  g.fill()
  g.stroke()
}

export function turretRendererFunctionFactory(
  frameIndexFraction: number,
  options: Partial<ITurretOptions> = DEFAULT_TURRET_OPTIONS
) {
  const merged = { ...DEFAULT_TURRET_OPTIONS, ...options }
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    turretRenderer(g, frameIndexFraction, merged)
  };
}
