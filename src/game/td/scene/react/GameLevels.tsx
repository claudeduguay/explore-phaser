import INavigator from "./INavigator"
import LevelButton from "./LevelButton"
import { DEFAULT_CONFIG, IMapConfig } from "../map/TDTileMap"
import { canvasSize } from "../../../../util/SceneUtil"
import { evaluateWaveDifficulty } from "../map/IWaveModel"
import { ILevelModel, computeHardestWave, computeLongestMap, generateLevel } from "../map/ILevelModel"

export interface IGameHomeProps {
  navigator: INavigator
}

export default function GameLevels({ navigator }: IGameHomeProps) {
  const { w, h } = canvasSize(navigator)
  const config: IMapConfig = DEFAULT_CONFIG
  const count = 20
  const levels: ILevelModel[] = []
  for (let i = 0; i < count; i++) {
    levels.push(generateLevel(config.rows, config.cols))
  }

  // Get max boundaries
  const longestMap = computeLongestMap(levels)
  const hardestWave = computeHardestWave(levels)
  // Difficulty is relative path length (normalized) + normalized wave difficulty
  const evaluateLevelDifficulty = (level: ILevelModel) => {
    return (level.path.length / longestMap) +
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
