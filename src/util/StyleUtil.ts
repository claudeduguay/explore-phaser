
// ----------------------------------------------------------------------------
// STROKE/FILL COLORING
// ----------------------------------------------------------------------------

export type Stroke = string | CanvasGradient | CanvasPattern;

export function maybeFill(g: CanvasRenderingContext2D, fill?: Stroke) {
  if (fill) {
    g.fillStyle = fill;
    g.fill();
  }
}

export function maybeStroke(g: CanvasRenderingContext2D, stroke?: Stroke) {
  if (stroke) {
    g.strokeStyle = stroke;
    g.stroke();
  }
}


// ----------------------------------------------------------------------------
// STYLE SPECIFICATION
// ----------------------------------------------------------------------------

export interface IFillStyle {
  color?: Stroke
  alpha?: number
}

export interface ILineStyle {
  color?: Stroke
  alpha?: number
  line?: number
}

export function fill(color?: Stroke, alpha?: number) {
  return { color, alpha }
}

export function line(color?: Stroke, alpha?: number, line?: number) {
  return { color, alpha, line }
}

export function applyFillStyle(g: CanvasRenderingContext2D, { color, alpha }: IFillStyle) {
  if (color) {
    g.fillStyle = color
  }
  if (alpha) {
    // Note: This might interfere with line style, since it's global
    g.globalAlpha = alpha
  }
}

export function applyLineStyle(g: CanvasRenderingContext2D, { color, alpha, line }: ILineStyle) {
  if (color) {
    g.strokeStyle = color
  }
  if (alpha) {
    // Note: This might interfere with fill style, since it's global
    g.globalAlpha = alpha
  }
  if (line) {
    g.lineWidth = line
  }
}