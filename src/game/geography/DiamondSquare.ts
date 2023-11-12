
import { Scene } from "phaser"
import { lerp, lerpInt } from "../../util/MathUtil"
import Point from "../../util/geom/Point"
import { IRGB, getPixel, setRGB } from "./ImageUtil"
import IRenderFunction from "../../util/IRenderFunction"
import { renderCanvas } from "../td/assets/TextureFactory"
import { getBiome } from "./Altitude"

// Adapted from:
// https://github.com/klaytonkowalski/example-diamond-square/blob/main/example/go.script
// JS Explanation: https://yonatankra.com/how-to-create-terrain-and-heightmaps-using-the-diamond-square-algorithm-in-javascript/

const BITS = 16
const DEFAULT_SIZE = new Point(Math.pow(BITS, 2) + 1, Math.pow(BITS, 2) + 1)
console.log(DEFAULT_SIZE)

export function is_valid_size(size: Point) {
  var l = Math.log(size.x - 1) / Math.log(2)
  var p = Math.pow(l, 2) + 1
  return size.x === p && size.y === p
}

export function randomColor(): IRGB {
  const v = lerp(0, 255, Math.random())
  return color(v)
}

export function clamp(v: number, min = 0.0, max = 1.0) {
  if (v < min) return min
  if (v > max) return max
  return v
}

export function color(v: number): IRGB {
  const c = Math.floor(v * 255)
  return [c, c, c]
}

export function average(array: Array<number>): number {
  let sum = 0
  array.forEach(v => {
    sum += v
  })
  return sum / array.length
  // return array.reduce((a, v) => a + v, 0) / array.length
}

export function randomizeVariance(randomVariance: number) {
  return lerp(-randomVariance, randomVariance, Math.random())
}

export function calculateDiamond(altitude: number[], size: Point, chunkSize: number) {
  const index = (x: number, y: number) => x + y * size.x
  const half = chunkSize / 2
  for (let y = 0; y < size.y - 1; y += chunkSize) {
    for (let x = 0; x < size.x - 1; x += chunkSize) {
      let values: number[] = [
        altitude[index(x, y)],                          // Top Left
        altitude[index(x + chunkSize, y)],              // Top Right
        altitude[index(x, y + chunkSize)],              // Bottom Left
        altitude[index(x + chunkSize, y + chunkSize)]   // Bottom Right
      ]
      // values = values.filter(v => v !== null)

      const avg = average(values)
      const variance = randomizeVariance(half)
      const v = avg + variance
      console.log(`Values: ${JSON.stringify(values)}, Avg: ${avg}, Var: ${variance}, Val: ${v}`)
      altitude[index(x + half, y + half)] = v
    }
  }
}

export function calculateSquare(altitude: number[], size: Point, chunkSize: number) {
  const half = chunkSize / 2
  const index = (x: number, y: number) => x + y * size.x
  for (let y = 0; y < size.y; y += half) {
    // for (let x = 0; x < size.x; x += half) {
    for (let x = (y + half) % chunkSize; x < size.x; x += chunkSize) {
      let values: number[] = []
      if (x - half >= 0) {
        values.push(altitude[index(x - half, y)])  // Left
      }
      if (x + half <= size.x) {
        values.push(altitude[index(x + half, y)])  // Right
      }
      if (y - half >= 0) {
        values.push(altitude[index(x, y - half)])  //Top
      }
      if (y + half <= size.y) {
        values.push(altitude[index(x, y + half)])  // Bottom
      }
      // values = values.filter(v => v !== null)
      const avg = average(values)
      const variance = randomizeVariance(half)
      const v = avg + variance
      altitude[index(y, x)] = v
    }
  }
}

export function diamondSquare(scene: Scene, key: string, size: Point = DEFAULT_SIZE) {
  // if (!is_valid_size(size)) {
  //   throw Error("Size must be a base 2 value, plus 1, in each dimension")
  // }

  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    const index = (x: number, y: number) => x + y * size.x
    let altitude = new Array<number>(size.x * size.y)
    altitude = altitude.fill(0)
    altitude[index(0, 0)] = Math.random()
    altitude[index(0, size.y - 1)] = Math.random()
    altitude[index(size.x - 1, 0)] = Math.random()
    altitude[index(size.x - 1, size.y - 1)] = Math.random()

    let chunkSize = size.x - 1
    while (chunkSize > 1) {
      console.log(`ChunkSize: ${chunkSize}`)
      calculateSquare(altitude, size, chunkSize)
      calculateDiamond(altitude, size, chunkSize)
      chunkSize /= 2
    }
    // console.log(JSON.stringify(altitude))

    // Set pixels based on altitudes
    const imageData = g.getImageData(0, 0, size.x, size.y)
    for (let y = 0; y < size.y - 1; y++) {
      for (let x = 0; x < size.x - 1; x++) {
        const e = altitude[index(x, y)]
        if (e) {
          setRGB(imageData, x, y, color(e))
        }
      }
    }
    g.putImageData(imageData, 0, 0)
  }
  renderCanvas(scene, key, size.x, size.y, render)
}
