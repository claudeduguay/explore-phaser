
// import Noise from "noisejs"

// Great artticle: https://www.redblobgames.com/maps/terrain-from-noise/
// https://medium.com/nerd-for-tech/generating-digital-worlds-using-perlin-noise-5d11237c29e9

export default class Landscape {
  constructor(public w: number, public h: number) {
  }

  generate() {
    // const noise = new Noise(Math.random())
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        // const value = noise.simplex2(x / this.w, y / this.h);
      }
    }
  }

  simpleBiome(value: number) {
    // From: https://www.redblobgames.com/maps/terrain-from-noise/
    // these thresholds will need tuning to match your generator
    // More complex example discussed in this article as well
    if (value < 0.1) return "WATER"
    if (value < 0.2) return "BEACH"
    if (value < 0.3) return "FOREST"
    if (value < 0.5) return "JUNGLE"
    if (value < 0.7) return "SAVANNAH"
    if (value < 0.9) return "DESERT"
    return "SNOW"
  }
}
