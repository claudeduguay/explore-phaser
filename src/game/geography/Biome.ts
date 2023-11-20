import { Math as PMath } from "phaser";

// Interesting ideas: https://www.pinterest.com/catwilcro/biome-colors/

import { IRGB } from "./ImageUtil"

// Reference: https://en.wikipedia.org/wiki/Web_colors
export const BIOMES: Record<string, IRGB> = {
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

const Vs = [
  BIOMES.DEEP_WATER,
  BIOMES.DEEP_WATER,
  BIOMES.DEEP_WATER,
  BIOMES.DEEP_WATER,
  BIOMES.WATER,
  BIOMES.WATER,
  BIOMES.BEACH,
  // BIOMES.SCORCHED,
  // BIOMES.BARE,
  // BIOMES.TUNDRA,
  BIOMES.SAVANNAH,
  BIOMES.GRASSLAND,
  BIOMES.SHRUBLAND,
  BIOMES.FOREST,
  BIOMES.JUNGLE,
  BIOMES.TEMPERATE_RAIN_FOREST,
  BIOMES.TEMPERATE_DECIDUOUS_FOREST,
  BIOMES.SUBTROPICAL_DESERT,
  BIOMES.DESERT,
  BIOMES.TEMPERATE_DESERT,
  // BIOMES.TAIGA,
  BIOMES.SNOW,
  // BIOMES.SNOW,
  // BIOMES.SNOW,
  // BIOMES.SNOW,
  // BIOMES.SNOW,
  // BIOMES.SNOW,
  // BIOMES.SNOW,
  // BIOMES.SNOW,
]
const Rs = Vs.map(v => v[0])
const Gs = Vs.map(v => v[1])
const Bs = Vs.map(v => v[2])

export function getBiome(f: number): IRGB {
  return [
    PMath.Interpolation.Linear(Rs, f),
    PMath.Interpolation.Linear(Gs, f),
    PMath.Interpolation.Linear(Bs, f)
  ]
}