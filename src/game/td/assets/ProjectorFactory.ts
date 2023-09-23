import { distributedStops, drawEllipse, drawPolygon, linearGradient } from "./util/DrawUtil";
import { canvasSize } from "./util/RenderUtil";

export type IProjectorType = "rect" | "point"

export interface IProjectorOptions {
  type: IProjectorType;
  margin: number;
  inset: number;
  ribs: number;
  balls: number;
  supressor?: { pos: number, len: number };
  gradient: string[];
  line: string;
}

export const DEFAULT_PROJECTOR_OPTIONS: IProjectorOptions = {
  type: "point",
  margin: 0,
  inset: 0.3,
  ribs: 3,
  balls: 0,
  // supressor: { pos: 0.2, len: 0.4 },
  gradient: ["#00F"],
  line: "white"
}

export function projectorRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IProjectorOptions) {
  const { type, margin, inset, ribs, balls, supressor, gradient, line } = options
  const { w, h } = canvasSize(g)
  const x = w * margin
  const y = h * margin
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  console.log("Width:", ww)
  const cx = ww / 2
  const main = { x: ww / 2 - ww * inset, w: ww * inset * 2 }
  // const main = { x: 0, w: ww }

  g.fillStyle = linearGradient(g, 0, 0, ww, 0, ...distributedStops(gradient))
  g.strokeStyle = line

  if (type === "rect") {
    g.fillRect(main.x, 0, main.w, h)
  }
  if (type === "point") {
    drawPolygon(g, [[0, hh], [ww, hh], [ww / 2, 0]])
    g.fill()
    g.stroke()
  }

  if (supressor) {
    g.fillRect(x, hh * supressor.pos, ww, hh * supressor.len)
  }

  for (let i = 0; i < ribs; i++) {
    g.fillStyle = line
    const p = hh * 0.15 + hh * 0.1 * i
    g.fillRect(x, p, ww, hh * 0.05)
  }

  for (let i = 0; i < balls; i++) {
    const p = cx + hh * 0.25 * i
    drawEllipse(g, cx, p, ww / 2, ww / 2)
    g.fill()
  }
}

export function projectorRendererFunctionFactory(
  frameIndexFraction: number,
  options: Partial<IProjectorOptions> = DEFAULT_PROJECTOR_OPTIONS
) {
  const merged = { ...DEFAULT_PROJECTOR_OPTIONS, ...options }
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    projectorRenderer(g, frameIndexFraction, merged)
  };
}
