
export type IRGB = [r: number, g: number, b: number, a?: number]

export function getPixel(imageData: ImageData, x: number, y: number): IRGB {
  const data = imageData.data
  const i = x + y * imageData.width
  const r = data[i * 4 + 0]
  const g = data[i * 4 + 1]
  const b = data[i * 4 + 2]
  const a = data[i * 4 + 3]
  return [r, g, b, a]
}

export function setRGB(imageData: ImageData, x: number, y: number, rgb: IRGB, a: number = 255) {
  setPixel(imageData, x, y, ...rgb)
}

export function setPixel(imageData: ImageData, x: number, y: number, r: number, g: number, b: number, a: number = 255) {
  const data = imageData.data
  const i = x + y * imageData.width
  data[i * 4 + 0] = r
  data[i * 4 + 1] = g
  data[i * 4 + 2] = b
  data[i * 4 + 3] = a
}
