import INavigator from "./INavigator"
import LevelButton from "./LevelButton"
import { DEFAULT_CONFIG, IMapConfig } from "../map/TDTileMap"
import { generatePath } from "../map/TDPath"
import IMapModel, { asMapModel } from "../map/IMapModel"
import { canvasSize } from "../../../../util/SceneUtil"
import { DEFAULT_WAVES, IWaveModel } from "../map/IWaveConfig"
import { ALL_ENEMIES } from "../../model/IEnemyModel"

export interface ILevelModel {
  map: IMapModel,
  waves: IWaveModel
}

export interface IGameHomeProps {
  navigator: INavigator
}

export default function GameLevels({ navigator }: IGameHomeProps) {
  const { w, h } = canvasSize(navigator)
  const config: IMapConfig = DEFAULT_CONFIG
  const count = 20
  const levels: ILevelModel[] = []
  for (let i = 0; i < count; i++) {
    const { path } = generatePath(config.rows, config.cols)
    levels.push({ map: asMapModel(path), waves: DEFAULT_WAVES })
  }

  // Find longest map for map difficulty evaluation
  const computeLongestMap = (models: ILevelModel[]) => {
    let longest = 0
    for (let model of models) {
      if (model.map.path.length > longest) {
        longest = model.map.path.length
      }
    }
    return longest
  }
  const longestMap = computeLongestMap(levels)

  // The difficulty of a wave is the total of levels for all enemies 
  const evaluateWaveDifficulty = (waves: IWaveModel): number => {
    let accumulator = 0
    waves.groups.forEach(group => {
      const model = ALL_ENEMIES.find(m => m.meta.body === group.key)
      accumulator += (model?.stats.level || 0) * group.count
    })
    return accumulator
  }

  // Get hardest wave based on accumulated enemy levels
  const computeHardestWave = (models: ILevelModel[]): number => {
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
  const hardestWave = computeHardestWave(levels)

  const evaluateLevelDifficulty = (level: ILevelModel) => {
    return (level.map.path.length / longestMap) +
      (evaluateWaveDifficulty(level.waves) / hardestWave)
  }

  // Sort by inverse normalized difficulty (easiest first)
  const inverseDifficulty = (a: ILevelModel, b: ILevelModel): number => {
    return evaluateLevelDifficulty(a) - evaluateLevelDifficulty(b)
  }
  levels.sort(inverseDifficulty)

  const onPlay = () => {
    navigator.transitionTo("play", "maps")
  }
  return <div className="p-1" style={{ width: w, height: h, background: "black" }}>
    <h1 className="text-white">Maps by Level</h1>
    <div className="p-2 text-white text-center">
      {levels.map((model, i) =>
        <LevelButton key={i} scene={navigator} navigator={navigator} model={model} title={`Level ${i + 1}`} onClick={onPlay} />)}
    </div>
  </div>
}
