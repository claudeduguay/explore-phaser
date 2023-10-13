// https://developer.mozilla.org/en-US/docs/Web/API/ImageData

export type IRGBA = { r: number, g: number, b: number, a: number }

export const BIT_SHIFT = {
  R: 24,
  G: 16,
  B: 8
}

export const BIT_MASK = {
  R: 0xFF000000,
  G: 0x00FF0000,
  B: 0x0000FF00,
  A: 0x000000FF
}

export function getPixel(imageData: ImageData, x: number, y: number, asRGBA: boolean = false): number | IRGBA {
  const { data, width, } = imageData
  const index = y * width + x * 4
  const rgba = {
    r: data[index + 0],
    g: data[index + 1],
    b: data[index + 2],
    a: data[index + 3]
  }
  if (asRGBA) {
    return rgba
  }
  return rgbaToColor(rgba)
}

export function setPixel(imageData: ImageData, x: number, y: number, color: number | IRGBA): void {
  const { data, width, } = imageData
  const index = y * width + x * 4
  const isNumber = typeof color === "number"
  data[index + 0] = isNumber ? colorToRed(color) : color.r
  data[index + 1] = isNumber ? colorToGreen(color) : color.g
  data[index + 2] = isNumber ? colorToBlue(color) : color.b
  data[index + 3] = isNumber ? colorToAlpha(color) : color.a
}

export function rgbaToColor({ r, g, b, a }: IRGBA, asFloat: boolean = false) {
  r = ((asFloat ? Math.floor(r * 255) : r) & 0xFF) << BIT_SHIFT.R
  g = ((asFloat ? Math.floor(g * 255) : g) & 0xFF) << BIT_SHIFT.G
  b = ((asFloat ? Math.floor(b * 255) : b) & 0xFF) << BIT_SHIFT.B
  a = ((asFloat ? Math.floor(a * 255) : a) & 0xFF)
  return r + g + b + a
}

export function colorToRed(color: number, asFloat: boolean = false): number {
  const result = (color & BIT_MASK.R) >>> BIT_SHIFT.R
  return asFloat ? result / 255.0 : color
}

export function colorToGreen(color: number, asFloat: boolean = false): number {
  const result = (color & BIT_MASK.G) >>> BIT_SHIFT.G
  return asFloat ? result / 255.0 : color
}

export function colorToBlue(color: number, asFloat: boolean = false): number {
  const result = (color & BIT_MASK.B) >>> BIT_SHIFT.B
  return asFloat ? result / 255.0 : color
}

export function colorToAlpha(color: number, asFloat: boolean = false): number {
  const result = (color & BIT_MASK.A)
  return asFloat ? result / 255.0 : color
}

export function colorToRGBA(color: number, asFloat: boolean = false): IRGBA {
  return {
    r: colorToRed(color, asFloat),
    g: colorToGreen(color, asFloat),
    b: colorToBlue(color, asFloat),
    a: colorToAlpha(color, asFloat)
  }
}
