import { Scene } from "phaser";
import { sceneSize } from "../../util/SceneUtil";
import IRenderFunction from "../../util/IRenderFunction";
import { renderCanvas } from "../td/assets/TextureFactory";
import { createNoise2D } from 'simplex-noise';

// Great article: https://www.redblobgames.com/maps/terrain-from-noise/
// https://medium.com/nerd-for-tech/generating-digital-worlds-using-perlin-noise-5d11237c29e9
// Very cool plasma effect. See: https://codepen.io/jwagner/pen/BNmpdm/?editors=001

export default class Geography extends Scene {

  constructor() {
    super('geography')
  }

  preload() {
    this.load.image("explosion", "assets/explosion/explosion00.png")
    this.createGeo()
  }

  createGeo() {
    const { w, h } = sceneSize(this)

    const noise = createNoise2D()
    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    const renderer: IRenderFunction = (g: CanvasRenderingContext2D): void => {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const nx = x / w // - 0.5
          const ny = y / h //- 0.5
          const v = (noise(nx, ny) + 1.0) / 2
          const p = Math.floor(v * 256)
          if (v > max) max = v
          if (v < min) min = v
          g.fillStyle = `#${p.toString(16)}${p.toString(16)}${p.toString(16)}`
          g.fillRect(x, y, 1, 1)
          // console.log(v, g.fillStyle)
        }
      }
      console.log("MinMax:", min, max)
    }
    renderCanvas(this, "geo", w, h, renderer)
  }

  create() {
    const { w, h } = sceneSize(this)
    this.add.sprite(w / 2, h / 2, "geo")
  }
}
