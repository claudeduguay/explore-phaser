
import { Scene } from "phaser"
import { lerp } from "../../util/MathUtil"
import Point from "../../util/geom/Point"
import { IRGB, setRGB } from "./ImageUtil"
import IRenderFunction from "../../util/IRenderFunction"
import { renderCanvas } from "../td/assets/TextureFactory"
import { getBiome } from "./Biome"

// Adapted from:
// https://github.com/klaytonkowalski/example-diamond-square/blob/main/example/go.script
// JS Explanation: https://yonatankra.com/how-to-create-terrain-and-heightmaps-using-the-diamond-square-algorithm-in-javascript/

const BITS = 10
const DEFAULT_SIZE = new Point(Math.pow(2, BITS) + 1, Math.pow(2, BITS) + 1)

export function is_valid_size(size: Point) {
  var l = Math.log(size.x - 1) / Math.log(2)
  var p = Math.pow(l, 2) + 1
  return size.x === p && size.y === p
}

export function randomColor(): IRGB {
  const v = lerp(0, 255, Math.random())
  return color(v)
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

export function calculateDiamond(altitude: number[], size: Point, chunkSize: number, variationScale: number) {
  const index = (x: number, y: number) => x + y * size.x
  const half = chunkSize / 2
  for (let y = 0; y < size.x - 1; y += chunkSize) {
    for (let x = 0; x < size.y - 1; x += chunkSize) {
      let values: number[] = [
        altitude[index(x, y)],                          // Top Left
        altitude[index(x + chunkSize, y)],              // Top Right
        altitude[index(x, y + chunkSize)],              // Bottom Left
        altitude[index(x + chunkSize, y + chunkSize)]   // Bottom Right
      ]
      const avg = average(values)
      const variance = randomizeVariance(variationScale)
      const v = avg + variance
      altitude[index(x + half, y + half)] = v
    }
  }
}

export function calculateSquare(altitude: number[], size: Point, chunkSize: number, variationScale: number) {
  const half = chunkSize / 2
  const index = (x: number, y: number) => x + y * size.x
  for (let y = 0; y < size.y; y += half) {
    // for (let x = 0; x < size; x += half) {
    for (let x = (y + half) % chunkSize; x < size.x; x += chunkSize) {
      let values: number[] = []
      if (x - half >= 0) {
        values.push(altitude[index(x - half, y)])  // Left
      }
      if (x + half < size.x) {
        values.push(altitude[index(x + half, y)])  // Right
      }
      if (y - half >= 0) {
        values.push(altitude[index(x, y - half)])  //Top
      }
      if (y + half < size.y) {
        values.push(altitude[index(x, y + half)])  // Bottom
      }
      values = values.filter(x => x !== 0)
      const avg = average(values)
      const variance = randomizeVariance(variationScale)
      const v = avg + variance
      altitude[index(x, y)] = v
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
    const corners = [
      new Point(0, 0),
      new Point(size.x - 1, 0),
      new Point(0, size.y - 1),
      new Point(size.x - 1, size.y - 1)
    ]
    corners.forEach(({ x, y }) => {
      altitude[index(x, y)] = lerp(0, 1, Math.random())
    })

    let chunkSize = Math.max(size.x, size.y) - 1
    // while (chunkSize > (size - 1) / 4) {
    while (chunkSize > 1) {
      const variationScale = chunkSize / Math.max(size.x, size.y) * 0.5
      calculateDiamond(altitude, size, chunkSize, variationScale)
      calculateSquare(altitude, size, chunkSize, variationScale)
      chunkSize /= 2
    }

    // Set pixels based on altitudes
    const showColor = true
    const imageData = g.getImageData(0, 0, size.x, size.y)
    for (let y = 0; y < size.x; y++) {
      for (let x = 0; x < size.y; x++) {
        const e = altitude[index(x, y)]
        if (e) {
          setRGB(imageData, x, y, showColor ? getBiome(e) : color(e))
        }
      }
    }
    g.putImageData(imageData, 0, 0)
  }
  renderCanvas(scene, key, size.x, size.y, render)
}
