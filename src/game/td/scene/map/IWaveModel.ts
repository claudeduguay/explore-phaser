import { lerpInt } from "../../../../util/MathUtil"
import { ALL_ENEMIES, ENEMY_MODELS } from "../../entity/model/IEnemyModel"

export interface IWaveGroup {
  key: string                      // Texture key to use for this group
  count: number                    // Number of enemies in group
  offset: number                   // Time offset before starting group
  spacing: number                  // Enemy spacing time within group
}

export type IWaveModel = IWaveGroup[]
export default IWaveModel

export const DEFAULT_WAVES: IWaveModel = [
  { key: ENEMY_MODELS.WEAK.meta.key, count: 3, offset: 0, spacing: 250 },
  { key: ENEMY_MODELS.MODERATE.meta.key, count: 3, offset: 1500, spacing: 250 },
  { key: ENEMY_MODELS.STRONG.meta.key, count: 3, offset: 3000, spacing: 250 }
]

// The difficulty of a wave is the total of levels for all enemies
// Note: Should also take spacing into account as closr enemies are harder
export function evaluateWaveDifficulty(waves: IWaveModel): number {
  let accumulator = 0
  waves.forEach(group => {
    const model = ALL_ENEMIES.find(m => m.meta.key === group.key)
    accumulator += (model?.stats.level || 0) * group.count
  })
  return accumulator
}

// Note: Enemy count for a given wave should increment over time
// Note: Enemy spacing withing a given wave can vary
export function generateWaves(count: number = 5) {
  const keys = ALL_ENEMIES.map(m => m.meta.key)
  const waveSpacing = lerpInt(1200, 1800, Math.random())
  const waves: IWaveModel = []
  for (let i = 0; i < count; i++) {
    const unitCount = lerpInt(2, 4, Math.random())
    const key = keys[Math.floor(Math.random() * (keys.length - 1))]
    waves.push({ key, count: unitCount, offset: waveSpacing * i, spacing: 250 })
  }
  return waves
}
