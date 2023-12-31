import { IColoring, colorStyle, drawEllipse, drawPolygon } from "../../../util/DrawUtil";
import { canvasSize, dimensions, IMarginInsets } from "../../../util/RenderUtil";
import { BOX, IBox, box, scaleBox } from "../../../util/geom/Box";

export type IWeaponType = "rect" | "point" | "funnel"
export interface IWeaponDecorator {
  count: number
  color: IColoring
  start: number
  step?: number
}

export interface IWeaponOptions extends IMarginInsets {
  type: IWeaponType
  ribs?: IWeaponDecorator
  balls?: IWeaponDecorator
  supressor?: { pos: number, len: number, color: IColoring }
  rails?: { color: IColoring }
  color: IColoring
  colorBox: IBox
  line?: string;
}

export const DEFAULT_WEAPON_OPTIONS: IWeaponOptions = {
  type: "point",
  margin: box(0),
  inset: box(0.3),
  color: ["#00F"],
  colorBox: BOX.TO_EAST
}

export function weaponRenderer(g: CanvasRenderingContext2D,
  frameIndexFraction: number, // Ignored but compatible
  options: IWeaponOptions) {
  const { type, rails, ribs, balls, supressor, color, colorBox, line } = options
  const { w, h, margin, inset } = dimensions(g, options)
  const x = margin.x1
  const ww = margin.w
  const hh = margin.h
  const cx = margin.cx

  g.fillStyle = colorStyle(g, { type: "fraction", x1: x, y1: 0, x2: ww, y2: 0 }, color)

  if (type === "rect") {
    g.fillRect(inset.x1, 0, inset.w, hh)
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

  const bounds = scaleBox(colorBox, w, h)

  if (rails) {
    g.strokeStyle = colorStyle(g, bounds, rails.color)
    g.lineWidth = 2
    g.moveTo(x + 1, 0)
    g.lineTo(x + 1, hh)
    g.stroke()
    // g.moveTo(x + ww / 2, 0)
    // g.lineTo(x + ww / 2, hh)
    // g.stroke()
    g.moveTo(ww - 1, 0)
    g.lineTo(ww - 1, hh)
    g.stroke()
  }

  if (supressor) {
    g.fillStyle = colorStyle(g, bounds, supressor.color)
    g.rect(x, hh * supressor.pos, ww - 1, hh * supressor.len)
    g.fill()
    g.stroke()
  }

  if (ribs) {
    g.strokeStyle = colorStyle(g, bounds, ribs.color)
    g.lineWidth = 0.5
    for (let i = 0; i < ribs.count; i++) {
      const p = hh * ribs.start + hh * (ribs.step || 0.1) * i
      g.moveTo(x, p)
      g.lineTo(x + ww - 1, p)
      g.stroke()
    }
  }

  if (balls) {
    for (let i = 0; i < balls.count; i++) {
      g.fillStyle = colorStyle(g, bounds, balls.color)
      const p = hh * balls.start + hh * 0.1 + hh * (balls.step || 0.25) * i
      drawEllipse(g, cx, p, ww / 2, ww / 2)
      g.fill()
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
  }
}
