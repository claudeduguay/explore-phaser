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

export function setPixel(imageData: ImageData, x: number, y: number, color: number | IRGBA, asFloat: boolean = false): void {
  const { data, width, } = imageData
  const index = (y * width + x) * 4
  if (typeof color === "number") {
    data[index + 0] = colorToRed(color)
    data[index + 1] = colorToGreen(color)
    data[index + 2] = colorToBlue(color)
    data[index + 3] = colorToAlpha(color)
  } else {
    if (asFloat) {
      color = rgbaFloatToInt(color as IRGBA)
    }
    data[index + 0] = color.r
    data[index + 1] = color.g
    data[index + 2] = color.b
    data[index + 3] = color.a
  }
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

export function rgbaIntToFloat(color: IRGBA): IRGBA {
  return {
    r: color.r / 255.0,
    g: color.g / 255.0,
    b: color.b / 255.0,
    a: color.a / 255.0
  }
}

export function rgbaFloatToInt(color: IRGBA): IRGBA {
  return {
    r: Math.floor(color.r * 255) & 0xFF,
    g: Math.floor(color.g * 255) & 0xFF,
    b: Math.floor(color.b * 255) & 0xFF,
    a: Math.floor(color.a * 255) & 0xFF,
  }
}

// Utility to return IRGBA from either an existing IRGBA or a byte and (optional) alpha value 
export function asRGBA(b: number | IRGBA, alpha?: number): IRGBA {
  if (typeof b === "number") {
    return { r: b, g: b, b: b, a: alpha || b }
  }
  return b
}
