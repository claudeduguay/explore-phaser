
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
