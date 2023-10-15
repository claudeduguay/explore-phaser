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

export const ENEMY_LIST: IEnemyModel[] = []
export const ENEMY_INDEX: { [key: string]: IEnemyModel } = {}

export function generateEnemies(scene: Scene, count: number = 5) {
  for (let i = 1; i <= count; i++) {
    // Register assets
    makePeep(scene, `peep_${i}`, 32, 32, randomPeepOptions())
    const peep = {
      key: `peep_${i}`,
      name: `Level ${i}`,
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
    }
    ENEMY_INDEX[peep.key] = peep
    ENEMY_LIST.push(peep)
  }
}
