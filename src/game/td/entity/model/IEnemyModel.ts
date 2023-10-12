import { Scene } from "phaser"
import { randomPeepOptions } from "../../assets/PeepFactory"
import { makePeep } from "../../assets/TextureFactory"

export interface IEnemyMeta {
}

export interface IEnemyStatistics {
  level: number
  health: number
  shield: number
  speed: number
  value: number
}

export interface IEnemyVulnerability {
  default: number
  [key: string]: number
}

export interface IEnemyModel {
  key: string
  name: string
  meta: IEnemyMeta
  stats: IEnemyStatistics
  vulnerability: IEnemyVulnerability
}

export default IEnemyModel

export const ENEMIES: IEnemyModel[] = []

export function generateEnemies(scene: Scene, count: number = 5) {
  for (let i = 1; i <= count; i++) {
    // Register assets
    makePeep(scene, `peep_${i}`, 32, 32, randomPeepOptions())
    ENEMIES.push({
      key: `peep_${i}`,
      name: `Level ${i} Enemy`,
      meta: {
      },
      stats: {
        level: i,
        health: 50 * i,
        shield: 50 * i,
        speed: 100,
        value: 10 * i
      },
      vulnerability: {
        default: 1
      }
    })
  }
}

// export const ENEMY_MODELS: Record<string, IEnemyModel> = {
//   WEAK: {
//     name: "Weak Enemy",
//     meta: {
//       key: "peep_weak",
//     },
//     stats: {
//       level: 1,
//       health: 50,
//       shield: 100,
//       speed: 100,
//       value: 10
//     },
//     vulnerability: {
//       default: 1
//     }
//   },
//   MODERATE: {
//     name: "Moderate Enemy",
//     meta: {
//       key: "peep_moderate"
//     },
//     stats: {
//       level: 2,
//       health: 100,
//       shield: 100,
//       speed: 100,
//       value: 15
//     },
//     vulnerability: {
//       default: 1
//     }
//   },
//   STRONG: {
//     name: "Strong Enemy",
//     meta: {
//       key: "peep_strong"
//     },
//     stats: {
//       level: 3,
//       health: 200,
//       shield: 100,
//       speed: 100,
//       value: 20
//     },
//     vulnerability: {
//       default: 1
//     }
//   }
// }

// export const ALL_ENEMIES: IEnemyModel[] = Object.values(ENEMY_MODELS)