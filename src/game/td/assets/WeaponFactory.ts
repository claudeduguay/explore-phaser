import { IColoring, colorStyle, drawEllipse, drawPolygon } from "../../../util/DrawUtil";
import { canvasSize, canvasDimensions } from "../../../util/RenderUtil";

export type IWeaponType = "rect" | "point" | "funnel"
export interface IWeaponDecorator {
  count: number
  color: IColoring
  start: number
  step?: number
}

export interface IWeaponOptions {
  type: IWeaponType;
  margin: number;
  inset: number;
  ribs?: IWeaponDecorator;
  balls?: IWeaponDecorator;
  supressor?: { pos: number, len: number, color: IColoring };
  color: IColoring
  line?: string;
}

export const DEFAULT_WEAPON_OPTIONS: IWeaponOptions = {
  type: "point",
  margin: 0,
  inset: 0.3,
  color: ["#00F"],
}

export function weaponRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IWeaponOptions) {
  const { type, margin, inset, ribs, balls, supressor, color: gradient, line } = options
  const { w, h } = canvasDimensions(g, options)
  const x = w * margin
  const y = h * margin
  const ww = w - (x * 2)
  const hh = h - (y * 2)
  const cx = ww / 2
  const main = { x: ww / 2 - ww * inset, w: ww * inset * 2 }

  g.fillStyle = colorStyle(g, { x1: x, y1: 0, x2: ww, y2: 0 }, gradient)

  if (type === "rect") {
    const r = main.x + main.w - 1
    drawPolygon(g, [[main.x, 0], [r, 0], [r, hh], [main.x, hh]])
    // g.fillRect(main.x, 0, main.w, h)
  }
  if (type === "point") {
    drawPolygon(g, [[0, hh], [ww, hh], [ww / 2, 0]])
  }
  if (type === "funnel") {
    drawPolygon(g, [[0, 0], [ww, 0], [ww / 2, hh]])
  }
  g.fill()
  if (line) {
    g.lineWidth = 0.5
    g.strokeStyle = line
    g.stroke()
  }

  if (supressor) {
    g.fillStyle = colorStyle(g, { x1: 0, y1: 0, x2: ww, y2: 0 }, supressor.color)
    g.rect(x, hh * supressor.pos, ww - 1, hh * supressor.len)
    g.fill()
    g.stroke()
  }

  if (ribs) {
    for (let i = 0; i < ribs.count; i++) {
      g.fillStyle = colorStyle(g, { x1: 0, y1: 0, x2: ww, y2: 0 }, ribs.color)
      const p = hh * ribs.start + hh * (ribs.step || 0.1) * i
      g.rect(x, p, ww - 1, hh * 0.05 - 1)
      g.fill()
      g.stroke()
    }
  }

  if (balls) {
    for (let i = 0; i < balls.count; i++) {
      g.fillStyle = colorStyle(g, { x1: 0, y1: 0, x2: ww, y2: 0 }, balls.color)
      const p = hh * balls.start + hh * 0.1 + hh * (balls.step || 0.25) * i
      drawEllipse(g, cx, p, ww / 2, ww / 2)
      g.fill()
      g.stroke()
    }
  }
}

export function weaponRendererFunctionFactory(
  frameIndexFraction: number,
  options: Partial<IWeaponOptions> = DEFAULT_WEAPON_OPTIONS
) {
  const merged = { ...DEFAULT_WEAPON_OPTIONS, ...options }
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    weaponRenderer(g, frameIndexFraction, merged)
  };
}
