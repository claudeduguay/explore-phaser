import { drawArc, rotated, Stroke } from "./util/DrawUtil";
import { canvasSize } from "./util/RenderUtil";

// TODO: Could reduce the use of right rendering by rotating left

const DEFAULT_BELT_FILL = "#45171d";
const DEFAULT_BELT_FORE = "#83580b";
const BELT_INSET = 0.25;
const EDGE_INSET = 0.1;

export type IPathType = "straight" | "end" | "turn" | "t" | "x"

export interface IPathOptions {
  type: IPathType;
  showArrow: boolean;
  baseColor: Stroke;
  edgeColor: Stroke;
  beltInset: number;
  edgeInset: number;
}

export const DEFAULT_PATH_OPTIONS: IPathOptions = {
  type: "straight",
  showArrow: true,
  baseColor: DEFAULT_BELT_FILL,
  edgeColor: DEFAULT_BELT_FORE,
  beltInset: BELT_INSET,
  edgeInset: EDGE_INSET
}


export function straightPathRendererFunctionFactory(
  frameIndexFraction: number, options: IPathOptions
) {
  return (g: CanvasRenderingContext2D) => {
    drawStraightPathBase(g, frameIndexFraction, options, true)
    drawStraightPathBase(g, frameIndexFraction, options)
  }
}

export function drawStraightPathBase(g: CanvasRenderingContext2D,
  frameIndexFraction: number, { baseColor, beltInset, edgeInset, edgeColor }: IPathOptions,
  edge: boolean = false) {
  const { w, h } = canvasSize(g)
  const l = w * (beltInset - (edge ? edgeInset : 0));
  const r = w - l * 2;
  g.fillStyle = edge ? edgeColor : baseColor;
  g.fillRect(l, 0, r, h);
}


export function endPathRendererFunctionFactory(
  frameIndexFraction: number, options: IPathOptions
) {
  return (g: CanvasRenderingContext2D) => {
    drawEndPathBase(g, frameIndexFraction, options, true)
    drawEndPathBase(g, frameIndexFraction, options)
  }
}

export function drawEndPathBase(g: CanvasRenderingContext2D,
  frameIndexFraction: number, { baseColor, beltInset, edgeInset, edgeColor }: IPathOptions,
  edge: boolean = false) {
  const { w, h } = canvasSize(g)
  const l = w * (beltInset - (edge ? edgeInset : 0));
  const r = w - l * 2;
  g.fillStyle = edge ? edgeColor : baseColor;
  g.fillRect(l, 0, r, h - l);
}


export function turnPathRendererFunctionFactory(
  frameIndexFraction: number, options: IPathOptions) {
  return (g: CanvasRenderingContext2D) => {
    drawTurnPathBase(g, frameIndexFraction, options, true)
    drawTurnPathBase(g, frameIndexFraction, options)
  }
}

export function drawTurnPathBase(g: CanvasRenderingContext2D,
  frameIndexFraction: number, { baseColor, beltInset, edgeInset, edgeColor }: IPathOptions,
  edge: boolean = false) {
  const { w, h } = canvasSize(g)
  const l = w * (beltInset - (edge ? edgeInset : 0));
  const r = w - l * 2;
  g.fillStyle = edge ? edgeColor : baseColor;
  g.beginPath();
  g.moveTo(r, h);
  drawArc(g, 0, h, w - l, 360, 270);
  g.lineTo(0, r);
  drawArc(g, 0, h, l, 270, 360);
  g.lineTo(r, h);
  g.closePath();
  g.fill();
}

export function splitLeftPathRendererFunctionFactory(
  frameIndexFraction: number, options: IPathOptions
) {
  return (g: CanvasRenderingContext2D) => {
    drawStraightPathBase(g, frameIndexFraction, options, true)
    drawTurnPathBase(g, frameIndexFraction, options, true)
    drawStraightPathBase(g, frameIndexFraction, options)
    drawTurnPathBase(g, frameIndexFraction, options)
  }
}


export function splitRightPathRendererFunctionFactory(
  frameIndexFraction: number, options: IPathOptions
) {
  return (g: CanvasRenderingContext2D) => {
    drawStraightPathBase(g, frameIndexFraction, options, true)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options, true), 270)
    drawStraightPathBase(g, frameIndexFraction, options)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options), 270)
  }
}


export function tPathRendererFunctionFactory(
  frameIndexFraction: number, options: IPathOptions
) {
  return (g: CanvasRenderingContext2D) => {
    drawTurnPathBase(g, frameIndexFraction, options, true)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options, true), 270)
    drawTurnPathBase(g, frameIndexFraction, options)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options), 270)
  }
}


export function xPathRendererFunctionFactory(
  frameIndexFraction: number, options: IPathOptions
) {
  return (g: CanvasRenderingContext2D) => {
    drawStraightPathBase(g, frameIndexFraction, options, true)
    drawTurnPathBase(g, frameIndexFraction, options, true)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options, true), 270)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options, true), 180)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options, true), 90)
    drawStraightPathBase(g, frameIndexFraction, options)
    drawTurnPathBase(g, frameIndexFraction, options)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options), 270)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options), 180)
    rotated(g, (g: CanvasRenderingContext2D) => drawTurnPathBase(g, frameIndexFraction, options), 90)
  }
}


export function pathRendererFunctionFactory(
  frameIndexFraction: number,
  options?: Partial<IPathOptions>
) {
  const merged = { ...DEFAULT_PATH_OPTIONS, ...options }
  switch (merged.type) {
    case "end":
      return endPathRendererFunctionFactory(frameIndexFraction, merged)
    case "turn":
      return turnPathRendererFunctionFactory(frameIndexFraction, merged)
    case "t":
      return tPathRendererFunctionFactory(frameIndexFraction, merged)
    case "x":
      return xPathRendererFunctionFactory(frameIndexFraction, merged)
    default:
      return straightPathRendererFunctionFactory(frameIndexFraction, merged)
  }
}
