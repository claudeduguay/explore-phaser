import { Scene } from "phaser";
import { sceneSize } from "../../util/SceneUtil";
import IRenderFunction from "../../util/IRenderFunction";
import { renderCanvas } from "../td/assets/TextureFactory";
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';

// Great article: https://www.redblobgames.com/maps/terrain-from-noise/
// https://medium.com/nerd-for-tech/generating-digital-worlds-using-perlin-noise-5d11237c29e9
// Very cool plasma effect. See: https://codepen.io/jwagner/pen/BNmpdm/?editors=001

type IRGB = [r: number, g: number, b: number]

// Interesting ideas: https://www.pinterest.com/catwilcro/biome-colors/
// Reference: https://en.wikipedia.org/wiki/Web_colors
const BIOMES: Record<string, IRGB> = {
  BEACH: [255, 228, 181], // Moccasin
  DEEP_WATER: [0, 0, 139], //DarkBlue
  WATER: [30, 144, 237], // DodgerBlue
  FOREST: [34, 139, 34], // ForestGreen
  JUNGLE: [0, 100, 0], // DarkGreen
  SAVANNAH: [210, 180, 140], // Tan
  DESERT: [245, 222, 179],  // Wheat
  SNOW: [255, 255, 255],  // White
  SCORCHED: [165, 42, 42],  // Brown
  BARE: [218, 165, 32],  // Goldenrod
  TUNDRA: [255, 255, 255],  // White
  TEMPERATE_DESERT: [244, 164, 96],  // SandyBrown
  SHRUBLAND: [0, 255, 127],  // SpringGreen
  GRASSLAND: [124, 252, 0],  // LawnGreen
  TEMPERATE_DECIDUOUS_FOREST: [143, 188, 143],  // DarkSeaGreen
  TEMPERATE_RAIN_FOREST: [0, 128, 0],  // Green
  SUBTROPICAL_DESERT: [173, 255, 47],  // GreenYellow
  TROPICAL_SEASONAL_FOREST: [107, 142, 35],  // OliveDrab
  TROPICAL_RAIN_FOREST: [46, 139, 87],  // SeaGreen
  TAIGA: [127, 255, 212], //Aquamarine
}

// const BIOMES: Record<string, IRGB> = {
//   BEACH: {r: 0, g: 0, b: 0 }
// }

function getBiome(e: number, m: number) {
  // these thresholds will need tuning to match your generator
  if (e < 0.2) return BIOMES.DEEP_WATER;
  if (e < 0.25) return BIOMES.WATER
  if (e < 0.3) return BIOMES.BEACH

  if (e > 0.8) {
    if (m < 0.1) return BIOMES.SCORCHED
    if (m < 0.2) return BIOMES.BARE
    if (m < 0.5) return BIOMES.TUNDRA
    return BIOMES.SNOW
  }

  if (e > 0.6) {
    if (m < 0.33) return BIOMES.TEMPERATE_DESERT
    if (m < 0.66) return BIOMES.SHRUBLAND
    return BIOMES.TAIGA
  }

  if (e > 0.3) {
    if (m < 0.16) return BIOMES.TEMPERATE_DESERT
    if (m < 0.50) return BIOMES.GRASSLAND
    if (m < 0.83) return BIOMES.TEMPERATE_DECIDUOUS_FOREST
    return BIOMES.TEMPERATE_RAIN_FOREST
  }

  if (m < 0.16) return BIOMES.SUBTROPICAL_DESERT
  if (m < 0.33) return BIOMES.GRASSLAND
  if (m < 0.66) return BIOMES.TROPICAL_SEASONAL_FOREST
  return BIOMES.TROPICAL_RAIN_FOREST
}

function setBiome(imageData: ImageData, x: number, y: number, e: number, m: number) {
  let rgb = getBiome(e, m)
  setRGB(imageData, x, y, rgb)
}

function setRGB(imageData: ImageData, x: number, y: number, rgb: IRGB, a: number = 255) {
  setPixel(imageData, x, y, ...rgb)
}

// function getPixel(imageData: ImageData, x: number, y: number) {
//   const data = imageData.data
//   const i = x + y * imageData.width
//   const r = data[i * 4 + 0]
//   const g = data[i * 4 + 1]
//   const b = data[i * 4 + 2]
//   return [r, g, b]
// }

function setPixel(imageData: ImageData, x: number, y: number, r: number, g: number, b: number, a: number = 255) {
  const data = imageData.data
  const i = x + y * imageData.width
  data[i * 4 + 0] = r
  data[i * 4 + 1] = g
  data[i * 4 + 2] = b
  data[i * 4 + 3] = 255
}

function computeValue(noise: NoiseFunction2D, frequencies: number[], ratios: number, x: number, y: number, w: number, h: number, pow: number = 2.00) {
  let v = 0
  frequencies.forEach((f, j) => {
    const nx = x / w * 4
    const ny = y / h * 4
    const n = (noise(nx * f, ny * f) + 1.0) / 2
    v += n * 1.0 / f
  })
  v /= ratios
  return Math.pow(v, pow)
}

export default class Geography extends Scene {

  constructor() {
    super('geography')
  }

  preload() {
    this.load.image("biome", "biome-lookup-smooth.png")
    this.createGeo()
  }

  createGeo() {
    const { w, h } = sceneSize(this)

    const noise = createNoise2D()
    const renderer: IRenderFunction = (g: CanvasRenderingContext2D): void => {
      const eFrequencies = [1, 2, 4]
      const eRatios = eFrequencies.reduce((a, v) => a += 1 / v, 0)
      const mFrequencies = [2, 4, 8]
      const mRatios = mFrequencies.reduce((a, v) => a += 1 / v, 0)
      const imageData = g.getImageData(0, 0, w, h)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let e = computeValue(noise, eFrequencies, eRatios, x, y, w, h)
          let m = computeValue(noise, mFrequencies, mRatios, x, y, w, h, 1)
          setBiome(imageData, x, y, e, m)
        }
      }
      g.putImageData(imageData, 0, 0)
    }
    renderCanvas(this, "geo", w, h, renderer)
  }

  create() {
    const { w, h } = sceneSize(this)
    this.add.sprite(w / 2, h / 2, "geo")
  }
}
