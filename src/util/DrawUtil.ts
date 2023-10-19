import Vector from "./Vector"
import { toRadians } from "./MathUtil"
import Rectangle from "./Rectangle"
import { Stroke, maybeStroke } from "./StyleUtil";
import { canvasSize } from "./RenderUtil";

export type Optional<T> = T | null | undefined;


// ----------------------------------------------------------------------------
// GRADIENTS
// ----------------------------------------------------------------------------

export interface IColorStop {
  offset: number;
  color: string;
}

export function isStop(obj: any): obj is IColorStop {
  return obj !== undefined &&
    typeof obj !== "string" &&
    "offset" in obj &&
    "color" in obj
}

// Function to create IColorStop using a simple: stop(p, c) syntax
export const stop = (offset: number, color: string): IColorStop => ({ offset, color })

export function distributedStops(colors: string[]) {
  return colors.map((c, i) => stop(i / Math.max(colors.length - 1, 1), c))
}

export function linearGradient(g: CanvasRenderingContext2D,
  x0: number, y0: number, x1: number, y1: number, ...stops: IColorStop[]) {
  const gradient = g.createLinearGradient(x0, y0, x1, y1)
  for (let { offset, color } of stops) {
    gradient.addColorStop(offset, color)
  }
  return gradient
}

export function radialGradient(g: CanvasRenderingContext2D,
  x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, ...stops: IColorStop[]) {
  const gradient = g.createRadialGradient(x0, y0, r0, x1, y1, r1)
  for (let { offset, color } of stops) {
    gradient.addColorStop(offset, color)
  }
  return gradient
}

export function conicGradient(g: CanvasRenderingContext2D,
  startAngle: number, x: number, y: number, ...stops: IColorStop[]) {
  const gradient = g.createConicGradient(startAngle, x, y)
  for (let { offset, color } of stops) {
    gradient.addColorStop(offset, color)
  }
  return gradient
}


// ----------------------------------------------------------------------------
// BOX DEFINITIONS, ALLOWS SCALING TO COMMON DIRECTIONS, USED BY colorStyle
// ----------------------------------------------------------------------------

export interface IBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export function box(all: number): IBox
export function box(horz: number, vert: number): IBox
export function box(x1: number, y1: number, x2: number, y2: number): IBox
export function box(a: number, b?: number, c?: number, d?: number): IBox {
  if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
    return { x1: a, y1: b, x2: c, y2: d }
  } else if (a !== undefined && b !== undefined) {
    return { x1: a, y1: b, x2: a, y2: b }
  } else {
    return { x1: a, y1: a, x2: a, y2: a }
  }
}

export function scaleBox(g: CanvasRenderingContext2D, box: IBox): IBox {
  const { w, h } = canvasSize(g)
  return {
    x1: box.x1 * w,
    y1: box.y1 * h,
    x2: box.x2 * w,
    y2: box.y2 * h
  }
}

// Scaleable direction IBox instances
export const BOX: { [key: string]: IBox } = {
  TO_SOUTH: { x1: 0, y1: 0, x2: 0, y2: 1 },
  TO_NORTH: { x1: 0, y1: 1, x2: 0, y2: 0 },
  TO_EAST: { x1: 0, y1: 0, x2: 1, y2: 0 },
  TO_WEST: { x1: 1, y1: 0, x2: 0, y2: 0 },
  TO_SE: { x1: 0, y1: 0, x2: 1, y2: 1 },
  TO_SW: { x1: 1, y1: 0, x2: 0, y2: 1 },
  TO_NW: { x1: 1, y1: 1, x2: 0, y2: 0 },
  TO_NE: { x1: 0, y1: 1, x2: 1, y2: 0 },
}


// ----------------------------------------------------------------------------
// COLORING (abstracts string | string[] | IColorStop[] for fill/line styles)
// ----------------------------------------------------------------------------

export type IColoring = string | string[] | IColorStop[]

export function colorStyle(g: CanvasRenderingContext2D,
  box: IBox, coloring: IColoring): string | CanvasGradient {
  const scaled = box // scaleBox(box)
  const { x1, y1, x2, y2 } = scaled
  if (Array.isArray(coloring)) {
    if (isStop(coloring[0])) {
      return linearGradient(g, x1, y1, x2, y2, ...coloring as IColorStop[])
    } else {
      const stops = distributedStops(coloring as string[])
      return linearGradient(g, x1, y1, x2, y2, ...stops)
    }
  }
  return coloring
}


// ----------------------------------------------------------------------------
// POINT ROTATION
// ----------------------------------------------------------------------------

export function rotateVector(g: CanvasRenderingContext2D, origin: Vector, angle: number) {
  rotate(g, origin.x, origin.y, angle);
}

export function rotate(g: CanvasRenderingContext2D, originX: number, originY: number, angle: number) {
  g.translate(originX, originY);
  g.rotate(toRadians(angle));
  g.translate(-originX, -originY);
}


// ----------------------------------------------------------------------------
// DRAW LINES
// ----------------------------------------------------------------------------

export function drawLineVector(g: CanvasRenderingContext2D, a: Vector, b: Vector, color?: Stroke) {
  drawLine(g, a.x, a.y, b.x, b.y, color);
}

export function drawLine(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color?: Stroke) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  maybeStroke(g, color)
}


// ----------------------------------------------------------------------------
// DRAW ARCS
// ----------------------------------------------------------------------------

export function drawArcVector(g: CanvasRenderingContext2D, center: Vector, r: number, startAngle: number, endAngle: number) {
  drawArc(g, center.x, center.y, r, startAngle, endAngle);
}

export function drawArc(g: CanvasRenderingContext2D, cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  g.arc(cx, cy, r, toRadians(startAngle), toRadians(endAngle), startAngle > endAngle);
}


// ----------------------------------------------------------------------------
// DRAW POLYGONS
// ----------------------------------------------------------------------------

export type NumberPair = [number, number];        // Easier to manage coordinate literals with arrays

export function drawPolygonVectors(g: CanvasRenderingContext2D, points: Vector[], strokes: Optional<Stroke>[] = [], closed: boolean = true) {
  drawPolygon(g, points.map(v => ([v.x, v.y])), strokes, closed);
}

// If strokes are provided they go from first line to closing line by index and lines are separate strokes
// Otherwise, the output shape is just a fillable, contigous set of joint lines.
export function drawPolygon(g: CanvasRenderingContext2D, pairs: NumberPair[], strokes: Optional<Stroke>[] = [], closed: boolean = true) {
  if (pairs.length > 1) {        // Need at least two points to draw a polygon
    if (strokes.length > 0) {    // If strokes are provided, we draw discrete line strokes
      let a = pairs[0];
      for (let i = 1; i < pairs.length; i++) {
        let b = pairs[i];
        let stroke = strokes[i - 1];
        if (stroke) {
          drawLine(g, a[0], a[1], b[0], b[1], stroke);
        }
        a = b;
      }
      const stroke = strokes[pairs.length - 1];
      if (strokes.length === pairs.length && stroke) {   // If there's a final stroke, it's closed, so we draw from last to first
        drawLine(g, a[0], a[1], pairs[0][0], pairs[0][1], stroke);
      }
    } else {   // No strokes provided, so draw the polygon as a fillable shape
      g.beginPath();
      g.moveTo(pairs[0][0], pairs[0][1]);
      for (let i = 1; i < pairs.length; i++) {
        g.lineTo(pairs[i][0], pairs[i][1]);
      }
      if (closed) {
        g.closePath();
      }
    }
  }
}


// ----------------------------------------------------------------------------
// DRAW ELLIPSES
// ----------------------------------------------------------------------------

export function drawEllipseVector(g: CanvasRenderingContext2D, center: Vector, radius: Vector) {
  drawEllipse(g, center.x, center.y, radius.x, radius.y);
}

export function drawEllipse(g: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  let k = .5522848;
  let ox = rx * k;      // horizontal control point offset
  let oy = ry * k;      // vertical control point offset
  let x = cx - rx;      // left
  let r = cx + rx;      // right
  let y = cy - ry;      // top
  let b = cy + ry;      // bottom
  g.beginPath();
  g.moveTo(x, cy);
  g.bezierCurveTo(x, cy - oy, cx - ox, y, cx, y);
  g.bezierCurveTo(cx + ox, y, r, cy - oy, r, cy);
  g.bezierCurveTo(r, cy + oy, cx + ox, b, cx, b);
  g.bezierCurveTo(cx - ox, b, x, cy + oy, x, cy);
}


// ----------------------------------------------------------------------------
// CARDINAL DIRECTION BIT MAPPING
// ----------------------------------------------------------------------------

export enum Cardinal {
  // Bit masks
  North = 0b0001,
  South = 0b0010,
  East = 0b0100,
  West = 0b1000,
  // Possible Combinations/Permutations
  NS = North + South,
  EW = East + West,
  NW = North + West,
  NE = North + East,
  SW = South + West,
  SE = South + East,
  NSE = North + South + East,
  NSW = North + South + West,
  EWS = East + West + South,
  EWN = East + West + North,
  NEWS = North + South + East + West,
}

export function hasBits(bits: number, mask: number) {
  return (bits & mask) === mask;
}


// ----------------------------------------------------------------------------
// BORDERS BASED ON CARDINAL BIT MAPPING
// ----------------------------------------------------------------------------

export function drawRectBordersVector(g: CanvasRenderingContext2D, pos: Vector, size: Vector, borders: number = 0) {
  drawRectBorders(g, pos.x, pos.y, size.x, size.y);
}

// Draw selected borders of a rectangle
export function drawRectBorders(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, borders: number = 0) {
  g.fillRect(x, y, w, h);
  if (hasBits(borders, Cardinal.North)) {
    drawLine(g, x, y, x + w, y);
  }
  if (hasBits(borders, Cardinal.South)) {
    drawLine(g, x, y + h, x + w, y + h);
  }
  if (hasBits(borders, Cardinal.West)) {
    drawLine(g, x, y, x, y + h);
  }
  if (hasBits(borders, Cardinal.East)) {
    drawLine(g, x + w, y, x + w, y + h);
  }
}


// ----------------------------------------------------------------------------
// IMAGE ROTATION ABSTRACTION
// ----------------------------------------------------------------------------

// Generalized rotation based on view Rectangle and origin fraction
export function rotated(g: CanvasRenderingContext2D,
  renderFunction: (g: CanvasRenderingContext2D) => void,
  angle: number = 0,
  view: Rectangle = new Rectangle(0, 0, g.canvas.width, g.canvas.height),
  xOriginFraction: number = 0.5, yOriginFraction: number = 0.5) {
  const cx: number = view.width * xOriginFraction;
  const cy: number = view.height * yOriginFraction;
  g.save();
  g.translate(view.x + cx, view.y + cy);
  g.rotate(toRadians(angle));
  g.translate(-cx, -cy);
  renderFunction(g);
  g.restore();
}

// Convert CanvasImageSource width/height values if necessary
export function asDimension(value: SVGAnimatedLength | number): number {
  if (value instanceof SVGAnimatedLength) {
    return value.animVal.value;
  }
  return value;
}

// export function rotatedImage(g: CanvasRenderingContext2D, image: CanvasImageSource,
//   x: number, y: number, angle: number, xOriginFraction: number = 0.5, yOriginFraction: number = 0.5) {
//   const view = new Rectangle(x, y, asDimension(image.width), asDimension(image.height));
//   const renderFunction = (g: CanvasRenderingContext2D) => g.drawImage(image, 0, 0);
//   rotated(g, renderFunction, view, angle, xOriginFraction, yOriginFraction)
// }

