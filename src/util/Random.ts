
export type IRange = [min: number, max: number, step?: number];

export function precision(value: number, step: number = 1) {
  return Math.floor(value / step) * step
}

export function randomRange([min, max, step = 1]: IRange) {
  // Adds step to range so values are inclusive
  const value = min + Math.random() * (max - min + step)
  return precision(value, step)
}

export function randomChoice<T>(options: T[]): T {
  return options[randomRange([0, options.length - 1])]
}

export function randomColor() {
  return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
}
