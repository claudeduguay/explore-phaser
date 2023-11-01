import { lerpInt } from "../../../../util/MathUtil"
import { randomChoice } from "../../../../util/Random"
import { ENEMY_INDEX, ENEMY_LIST } from "../../entity/model/IEnemyModel"

export interface IWaveGroup {
  key: string                      // Texture key to use for this group
  count: number                    // Number of enemies in group
  offset: number                   // Time offset before starting group
  spacing: number                  // Enemy spacing time within group
}

export type IWaveModel = IWaveGroup[]
export default IWaveModel

export const defaultWaveModel = (): IWaveModel => [
  { key: ENEMY_LIST[0].key, count: 3, offset: 0, spacing: 250 },
  { key: ENEMY_LIST[1].key, count: 3, offset: 1500, spacing: 250 },
  { key: ENEMY_LIST[2].key, count: 3, offset: 3000, spacing: 250 },
  { key: ENEMY_LIST[3].key, count: 3, offset: 4500, spacing: 250 },
  { key: ENEMY_LIST[4].key, count: 3, offset: 6000, spacing: 250 }
]

// The difficulty of a wave is the total of levels for all enemies
// Note: Should also take spacing into account as closr enemies are harder
export function evaluateWaveDifficulty(waves: IWaveModel): number {
  let accumulator = 0
  waves.forEach(group => {
    const model = ENEMY_INDEX[group.key]
    accumulator += (model?.general.level || 0) * group.count
  })
  return accumulator
}

// Note: Enemy count for a given wave should increment over time
// Note: Enemy spacing withing a given wave can vary
export function generateWaves(count: number = 5) {
  const keys = ENEMY_LIST.map(m => m.key)
  const waveSpacing = lerpInt(1200, 1800, Math.random())
  const waves: IWaveModel = []
  for (let i = 0; i < count; i++) {
    const unitCount = lerpInt(2, 4, Math.random())
    const key = randomChoice(keys)
    waves.push({ key, count: unitCount, offset: waveSpacing * i, spacing: 250 })
  }
  return waves
}
