import { Scene } from "phaser";
import { sceneSize } from "../../util/SceneUtil";
import IRenderFunction from "../../util/IRenderFunction";
import { renderCanvas } from "../td/assets/TextureFactory";
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';
import Button, { makeButtonTextures } from "../td/gui/Button";
import { setRGB } from "./ImageUtil";
import { diamondSquare } from "./DiamondSquare";
import { getBiome } from "./Altitude";

// Great article: https://www.redblobgames.com/maps/terrain-from-noise/
// https://medium.com/nerd-for-tech/generating-digital-worlds-using-perlin-noise-5d11237c29e9
// Very cool plasma effect. See: https://codepen.io/jwagner/pen/BNmpdm/?editors=001


function setBiome(imageData: ImageData, x: number, y: number, e: number, m: number) {
  let rgb = getBiome(e)
  setRGB(imageData, x, y, rgb)
}

function computeOctaves(noise: NoiseFunction2D, frequencies: number[], ratios: number, x: number, y: number, w: number, h: number, pow: number = 2.00) {
  let v = 0
  frequencies.forEach((f, j) => {
    const nx = x / w * 2
    const ny = y / h * 2
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
    makeButtonTextures(this)
    this.generate()
  }

  generateGeography(key: string) {
    const { w, h } = sceneSize(this)
    const noise = createNoise2D()
    const renderer: IRenderFunction = (g: CanvasRenderingContext2D): void => {
      const eFrequencies = [1, 2, 4, 8, 16]
      const eRatios = eFrequencies.reduce((a, v) => a += 1 / v, 0)
      const imageData = g.getImageData(0, 0, w, h)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let f = computeOctaves(noise, eFrequencies, eRatios, x, y, w, h)
          setBiome(imageData, x, y, f, 0)
        }
      }
      g.putImageData(imageData, 0, 0)
    }
    renderCanvas(this, key, w, h, renderer)
  }

  generate() {
    if (this.textures.exists("geo")) {
      this.textures.remove("geo")
    }
    const useDiamongSquare = false
    if (useDiamongSquare) {
      diamondSquare(this, "geo")
    } else {
      this.generateGeography("geo")
    }
  }

  create() {
    const { w, h } = sceneSize(this)
    const sprite = this.add.sprite(w / 2, h / 2, "geo")
    const button = new Button(this, 60, 25, 100, 30, "Generate")
    button.onClick = () => {
      this.generate()
      sprite.setTexture("geo")
    }
    this.add.existing(button)
  }
}
