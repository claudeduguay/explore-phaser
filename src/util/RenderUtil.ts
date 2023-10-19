import RenderFunction from "./IRenderFunction";
import { IBox } from "./geom/Box";

export function invertTime(frameIndexFraction: number, invert: boolean) {
  return invert ? 1.0 - frameIndexFraction : frameIndexFraction
}

export function negate(value: number, invert: boolean) {
  return invert ? -value : value
}

export function canvasSize(g: CanvasRenderingContext2D): { w: number, h: number } {
  return { w: g.canvas.width, h: g.canvas.height }
}

export interface IMarginInsets {
  margin: IBox
  inset: IBox
}

export function canvasDimensions(g: CanvasRenderingContext2D, { margin, inset }: IMarginInsets) {
  const { w, h } = canvasSize(g)
  return {
    w, h,
    mx: w * margin.x1, my: h * margin.y1,
    mw: w - w * margin.x2 * 2, mh: h - h * margin.x2 * 2,
    cx: w / 2, cy: h / 2,
    ix: w * inset.x1, iy: h * inset.y1
  }
}

export function renderCanvas(
  width: number,
  height: number,
  renderer: RenderFunction
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext("2d");
  if (g) {
    renderer(g);
  }
  return canvas;
}

export type FrameRenderFactory = (
  frameIndexFraction: number,
  ...rendererArgs: any[]
) => RenderFunction;

// Render a collection of frames based on a frameIndex (fraction), rendererBuilder function and optional (other) parameters
export function renderFrames(
  width: number,
  height: number,
  frameCount: number,
  frameRendererFactory: FrameRenderFactory,
  ...rendererArgs: any[]
): CanvasImageSource[] {
  const frames: CanvasImageSource[] = [];
  for (let i = 0; i < frameCount; i++) {
    frames[i] = renderCanvas(
      width,
      height,
      frameRendererFactory(i / frameCount, ...rendererArgs)
    );
  }
  return frames;
}
