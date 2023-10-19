import Point from "./geom/Point";

export function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

export function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

/**
 * Clamp value between two constraints
 * @param value
 * @param min 
 * @param max 
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Wrap value between two constraints
 * @param value 
 * @param min 
 * @param max 
 */
export function wrap(value: number, min: number, max: number): number {
  while (value < min) value += (max - min);
  while (value > max) value -= (max - min);
  return value;
}

export type SnapStrategy = "floor" | "ceil" | "none";

/**
 * Snap value to a given cell size using the specified strategy.
 * @param value 
 * @param cellSize 
 * @param strategy 
 */
export function snap(value: number, cellSize: number, strategy: SnapStrategy = "floor"): number {
  const scaled = value / cellSize;
  if (strategy === "none") {
    return scaled * cellSize;
  }
  return Math[strategy](scaled) * cellSize;
}


export function lerp(min: number, max: number, f: number) {
  return min + (max - min) * f
}

export function bezier(source: number, p1: number, p2: number, target: number, f: number) {
  return (1 - f) * (1 - f) * (1 - f) * source +
    3 * (1 - f) * (1 - f) * f * p1 +
    3 * (1 - f) * f * f * p2 +
    f * f * f * target
}

export function lerpInt(min: number, max: number, f: number) {
  return Math.floor(lerp(min, max, f))
}


// Minics Phaser angle (radians)
export function rotation(cx: number, cy: number, rx: number, ry: number, rotation: number): Point {
  rotation -= Math.PI / 2
  return new Point(
    cx + Math.cos(rotation) * rx,
    cy + Math.sin(rotation) * ry
  )
}

// Minics Phaser angle (degrees)
export function angle(cx: number, cy: number, rx: number, ry: number, angle: number): Point {
  return rotation(cx, cy, rx, ry, toRadians(angle))
}
