import IPathModel, { asPathModel } from "./IPathModel"
import IWaveModel, { generateWaves, evaluateWaveDifficulty } from "./IWaveModel"
import { generatePath } from "./TDPath"
import { DEFAULT_CONFIG, IMapConfig } from "./TDTileMap"

export interface ILevelModel {
  path: IPathModel
  waves: IWaveModel
}

export function generateLevel(config: IMapConfig = DEFAULT_CONFIG): ILevelModel {
  const { path } = generatePath(config.rows, config.cols)
  const waves = generateWaves()
  return { path: asPathModel(path), waves }
}

// Find longest map for map difficulty evaluation
export function computeLongestMap(levels: ILevelModel[]) {
  let longest = 0
  for (let model of levels) {
    if (model.path.length > longest) {
      longest = model.path.length
    }
  }
  return longest
}

// Get hardest wave based on accumulated enemy levels
export function computeHardestWave(models: ILevelModel[]): number {
  let hardest = 0
  models.forEach(level => {
    let difficulty = evaluateWaveDifficulty(level.waves)
    if (difficulty > hardest) {
      hardest = difficulty
    }
    return hardest
  })
  return hardest
}
