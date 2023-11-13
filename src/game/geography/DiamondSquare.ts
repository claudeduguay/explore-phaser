
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

const BITS = 8
const DEFAULT_SIZE = Math.pow(2, BITS) + 1
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
  // let sum = 0
  // array.forEach(v => {
  //   sum += v
  // })
  // return sum / array.length
  return array.reduce((a, v) => a + v, 0) / (array.length * 1.0)
}

export function randomizeVariance(randomVariance: number) {
  return lerp(-randomVariance, randomVariance, Math.random())
}

export function calculateDiamond(altitude: number[], size: number, chunkSize: number, variationScale: number) {
  const index = (x: number, y: number) => x + y * size
  const half = chunkSize / 2
  for (let y = 0; y < size - 1; y += chunkSize) {
    for (let x = 0; x < size - 1; x += chunkSize) {
      let values: number[] = [
        altitude[index(x, y)],                          // Top Left
        altitude[index(x + chunkSize, y)],              // Top Right
        altitude[index(x, y + chunkSize)],              // Bottom Left
        altitude[index(x + chunkSize, y + chunkSize)]   // Bottom Right
      ]

      const avg = average(values)
      const variance = randomizeVariance(variationScale)
      const v = clamp(avg + variance)
      // console.log(`${JSON.stringify(values)} --> ${v}`)
      // console.log(`Values: ${JSON.stringify(values)}, Avg: ${avg}, Var: ${variance}, Val: ${v}`)
      altitude[index(x + half, y + half)] = v
    }
  }
}

export function calculateSquare(altitude: number[], size: number, chunkSize: number, variationScale: number) {
  const half = chunkSize / 2
  const index = (x: number, y: number) => x + y * size
  for (let y = 0; y < size; y += half) {
    // for (let x = 0; x < size; x += half) {
    for (let x = (y + half) % chunkSize; x < size; x += chunkSize) {
      let values: number[] = []
      if (x - half >= 0) {
        values.push(altitude[index(x - half, y)])  // Left
      }
      if (x + half < size) {
        values.push(altitude[index(x + half, y)])  // Right
      }
      if (y - half >= 0) {
        values.push(altitude[index(x, y - half)])  //Top
      }
      if (y + half < size) {
        values.push(altitude[index(x, y + half)])  // Bottom
      }
      const avg = average(values)
      const variance = randomizeVariance(variationScale)
      const v = clamp(avg + variance)
      // console.log(`[${x}, ${y}]: ${JSON.stringify(values)} --> ${v}`)
      altitude[index(y, x)] = v
    }
  }
}

export function diamondSquare(scene: Scene, key: string, size: number = DEFAULT_SIZE) {
  // if (!is_valid_size(size)) {
  //   throw Error("Size must be a base 2 value, plus 1, in each dimension")
  // }

  const render: IRenderFunction = (g: CanvasRenderingContext2D) => {
    const index = (x: number, y: number) => x + y * size
    let altitude = new Array<number>(size * size)
    altitude = altitude.fill(0.5)
    let chunkSize = size - 1
    const corners = [
      new Point(0, 0),
      new Point(0, chunkSize),
      new Point(chunkSize, 0),
      new Point(chunkSize, chunkSize)
    ]
    corners.forEach(({ x, y }, i) => {
      altitude[index(x, y)] = lerp(0, 1, Math.random())
      console.log(altitude[index(x, x)])
    })

    while (chunkSize > 1) {
      const variationScale = chunkSize / size * 10
      console.log(`ChunkSize: ${chunkSize}, variation: ${variationScale}`)
      calculateDiamond(altitude, size, chunkSize, variationScale)
      calculateSquare(altitude, size, chunkSize, variationScale)
      chunkSize /= 2
    }
    // console.log(JSON.stringify(altitude))

    // Set pixels based on altitudes
    const showColor = false
    const imageData = g.getImageData(0, 0, size, size)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const e = altitude[index(x, y)]
        if (e) {
          setRGB(imageData, x, y, showColor ? getBiome(e) : color(e))
        }
      }
    }
    g.putImageData(imageData, 0, 0)
  }
  renderCanvas(scene, key, size, size, render)
}
