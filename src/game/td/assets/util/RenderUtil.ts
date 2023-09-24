import RenderFunction from "./IRenderFunction";

export function invertTime(frameIndexFraction: number, invert: boolean) {
  return invert ? 1.0 - frameIndexFraction : frameIndexFraction
}

export function negate(value: number, invert: boolean) {
  return invert ? -value : value
}

export function canvasSize(g: CanvasRenderingContext2D): { w: number, h: number } {
  return { w: g.canvas.width, h: g.canvas.height }
}

export function canvasDims(g: CanvasRenderingContext2D, margin: number, inset: number) {
  const { w, h } = canvasSize(g)
  return {
    w, h,
    mx: w * margin, my: h * margin,
    mw: w - w * margin * 2, mh: h - h * margin * 2,
    cx: w / 2, cy: h / 2,
    ix: w * inset, iy: h * inset
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
