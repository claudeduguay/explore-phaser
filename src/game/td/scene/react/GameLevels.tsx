import INavigator from "./INavigator"
import MapButton from "./LevelButton"
import { DEFAULT_CONFIG, IMapConfig } from "../map/TDTileMap"
import { generatePath } from "../map/TDPath"
import IMapModel, { asMapModel } from "../map/IMapModel"
import { canvasSize } from "../../../../util/SceneUtil"
import { DEFAULT_WAVES, IWaveModel } from "../map/IWaveConfig"

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
  const models: ILevelModel[] = []
  for (let i = 0; i < count; i++) {
    const { path } = generatePath(config.rows, config.cols)
    models.push({ map: asMapModel(path), waves: DEFAULT_WAVES })
  }
  // Sort by longest path first (shortest paths are hardest)
  models.sort((a: ILevelModel, b: ILevelModel): number => {
    return b.map.path.length - a.map.path.length
  })

  const onPlay = () => {
    navigator.transitionTo("play", "maps")
  }
  return <div className="p-1" style={{ width: w, height: h, background: "black" }}>
    <h1 className="text-white">Maps by Level</h1>
    <div className="p-2 text-white text-center">
      {models.map((model, i) =>
        <MapButton key={i} scene={navigator} navigator={navigator} model={model} title={`Level ${i + 1}`} onClick={onPlay} />)}
    </div>
  </div>
}
