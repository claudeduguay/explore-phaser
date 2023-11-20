
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';
import IRenderFunction from '../../util/IRenderFunction';
import { getBiome } from './Biome';
import { setRGB } from './ImageUtil';
import { Scene } from 'phaser';
import { renderCanvas } from '../td/assets/TextureFactory';
import Grid from '../../maze/Grid';

function computeOctaves(noise: NoiseFunction2D, frequencies: number[], ratio: number, x: number, y: number, w: number, h: number, pow: number = 2.00) {
  let v = 0
  frequencies.forEach((f, j) => {
    const nx = x / w * 2
    const ny = y / h * 2
    const n = (noise(nx * f, ny * f) + 1.0) / 2
    v += n * 1.0 / f
  })
  v /= ratio
  return Math.pow(v, pow)
}

export function setBiome(imageData: ImageData, x: number, y: number, e: number, m: number) {
  let rgb = getBiome(e)
  setRGB(imageData, x, y, rgb)
}

export function generateLandscape(imageData: ImageData, w: number, h: number, frequencies = [1, 2, 4, 8, 16]) {
  const noise = createNoise2D()
  const ratio = frequencies.reduce((a, v) => a += 1 / v, 0)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let f = computeOctaves(noise, frequencies, ratio, x, y, w, h)
      setBiome(imageData, x, y, f, 0)
    }
  }
}

export function generateGeography(scene: Scene, key: string, w: number, h: number, frequencies = [1, 2, 4, 8, 16]) {
  const renderer: IRenderFunction = (g: CanvasRenderingContext2D): void => {
    const imageData = g.getImageData(0, 0, w, h)
    generateLandscape(imageData, w, h, frequencies)
    g.putImageData(imageData, 0, 0)
  }
  renderCanvas(scene, key, w, h, renderer)
}

export function generateGrid(w: number, h: number, frequencies = [1, 2, 4, 8, 16]) {
  const grid = new Grid(h, w)
  const noise = createNoise2D()
  const ratio = frequencies.reduce((a, v) => a += 1 / v, 0)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let f = computeOctaves(noise, frequencies, ratio, x, y, w, h)
      grid.set_at(x, y, f)
    }
  }
  return grid
}
