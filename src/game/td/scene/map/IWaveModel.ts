import { lerp } from "../../../../util/MathUtil"
import { ALL_ENEMIES } from "../../model/IEnemyModel"

export interface IWaveGroup {
  key: string                      // Texture key to use for this group
  count: number                    // Number of enemies in group
  offset: number                   // Time offset before starting group
  spacing: number                  // Enemy spacing time within group
}

export type IWaveModel = IWaveGroup[]
export default IWaveModel

export const DEFAULT_WAVES: IWaveModel = [
  { key: "path-green", count: 3, offset: 0, spacing: 250 },
  { key: "path-blue", count: 3, offset: 1500, spacing: 250 },
  { key: "path-red", count: 3, offset: 3000, spacing: 250 }
]

// The difficulty of a wave is the total of levels for all enemies 
export function evaluateWaveDifficulty(waves: IWaveModel): number {
  let accumulator = 0
  waves.forEach(group => {
    const model = ALL_ENEMIES.find(m => m.meta.body === group.key)
    accumulator += (model?.stats.level || 0) * group.count
  })
  return accumulator
}

export function generateWaves(count: number = 5) {
  const waveSpacing = 1500
  const waves: IWaveModel = []
  const keys = ALL_ENEMIES.map(m => m.meta.body)
  for (let i = 0; i < count; i++) {
    const unitCount = Math.floor(lerp(2, 4, Math.random()))
    const key = keys[Math.floor(Math.random() * (keys.length - 1))]
    waves.push({ key, count: unitCount, offset: waveSpacing * i, spacing: 250 })
  }
  return waves
}
