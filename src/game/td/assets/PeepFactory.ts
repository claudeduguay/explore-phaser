import { Display } from "phaser";
import { drawEllipse } from "../../../util/DrawUtil";
import { IRange, randomChoice, randomRange } from "../../../util/Random";
import { canvasSize } from "../../../util/RenderUtil";


// https://www.vecteezy.com/vector-art/6683568-skin-tones-palette-by-color-codes-different-types-human-skin-flat-icon-set-vector
export const SKIN_LIST: string[] = [
  "#FFDFC4", "#EACBA8", "#F7E2AB", "#DCB991", "#F0C08A",
  "#E7BC91", "#ECBF83", "#CF9E7C", "#AC8B64", "#94613C",
  "#B26A49", "#AE703A", "#99644D", "#623A18", "#3F2818"
]

export const TYPE_LIST = ["north", "south", "east", "west"]

export const HEAD_WIDTH_RANGE: IRange = [4.5, 6, 0.5]
export const HEAD_HEIGHT_RANGE: IRange = [4.5, 6.5, 0.5]
export const BODY_WIDTH_RANGE: IRange = [6, 11, 0.5]
export const BODY_HEIGHT_RANGE: IRange = [10, 12]


export type IPeepType = "north" | "south" | "east" | "west";

export interface IPeepOptions {
  type: IPeepType;
  headWidth: number;
  headHeight: number;
  bodyWidth: number;
  bodyHeight: number;
  headStroke: string;
  bodyStroke: string;
  headColor: string;
  bodyColor: string;
}

export const DEFAULT_PEEP_OPTIONS: IPeepOptions = {
  type: "east",
  headWidth: 6,
  headHeight: 6,
  bodyWidth: 9,
  bodyHeight: 14,
  headColor: "#eebb99",
  headStroke: "#000000",
  bodyColor: "#ffaa00",
  bodyStroke: "#000000",
}

export function randomBodyColor() {
  return Display.Color.HSLToColor(Math.random(), 1, 0.33).rgba
}

export function randomPeepOptions(): Partial<IPeepOptions> {
  return {
    headWidth: randomRange(HEAD_WIDTH_RANGE),
    headHeight: randomRange(HEAD_HEIGHT_RANGE),
    bodyWidth: randomRange(BODY_WIDTH_RANGE),
    bodyHeight: randomRange(BODY_HEIGHT_RANGE),
    headColor: randomChoice(SKIN_LIST),
    bodyColor: randomBodyColor(),
  }
}

function drawHead(
  g: CanvasRenderingContext2D,
  frameIndexFraction: number,
  { type, headColor, headStroke, headWidth, headHeight }: IPeepOptions
) {
  const { w, h } = canvasSize(g)
  const xf = w / 32
  const yf = h / 32
  const bob = Math.sin(frameIndexFraction * Math.PI) * 4
  let x = 16 * xf
  if (type === "west") {
    x -= (3.5 * xf)
  }
  if (type === "east") {
    x += (3.5 * xf)
  }
  g.save()
  g.fillStyle = headColor
  g.strokeStyle = headStroke
  g.lineWidth = 1
  drawEllipse(g, x, (8 + 1 + bob) * xf, headWidth * xf, headHeight * yf)
  g.fill()
  g.stroke()
  g.restore()
}

function drawBody(
  g: CanvasRenderingContext2D,
  frameIndexFraction: number,
  { bodyColor, bodyStroke, bodyWidth, bodyHeight }: IPeepOptions) {
  const { w, h } = canvasSize(g)
  const xf = w / 32
  const yf = h / 32
  const bob = Math.sin(frameIndexFraction * Math.PI) * 6
  g.save()
  g.fillStyle = bodyColor
  g.strokeStyle = bodyStroke
  g.lineWidth = 1
  drawEllipse(g, 16 * xf, ((14 + bodyHeight / 2 + bob) * yf), bodyWidth * xf, bodyHeight * yf)
  g.fill()
  g.stroke()
  g.restore()
}

export function peepRendererFunctionFactory(
  frameIndexFraction: number,
  options: Partial<IPeepOptions> = DEFAULT_PEEP_OPTIONS
) {
  const merged = { ...DEFAULT_PEEP_OPTIONS, ...options }
  return (g: CanvasRenderingContext2D) => {
    const { w, h } = canvasSize(g)
    g.rect(0, 0, w, h)
    g.clip()
    if (options.type !== "north") {
      drawBody(g, frameIndexFraction, merged)
      drawHead(g, frameIndexFraction, merged)
    } else {
      drawHead(g, frameIndexFraction, merged)
      drawBody(g, frameIndexFraction, merged)
    }
  };
}
