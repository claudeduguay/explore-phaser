import INavigator from "./INavigator"
import MapButton from "./MapButton"
import { DEFAULT_CONFIG, IMapConfig } from "../map/TDTileMap"
import { generatePath } from "../map/TDPath"
import IMapModel, { asMapModel } from "../map/IMapModel"

export interface IGameHomeProps {
  navigator: INavigator
}

export default function GameMaps({ navigator }: IGameHomeProps) {
  const config: IMapConfig = DEFAULT_CONFIG
  const count = 20
  const models: IMapModel[] = []
  for (let i = 0; i < count; i++) {
    const { path } = generatePath(config.rows, config.cols)
    models.push(asMapModel(path))
  }
  // Sort by longest path first (shortest paths are hardest)
  models.sort((a: IMapModel, b: IMapModel): number => {
    return b.path.length - a.path.length
  })

  const onPlay = () => {
    navigator.transitionTo("play", "maps")
  }
  return <div className="p-1" style={{ width: 1100, height: 800, background: "black" }}>
    <h1 className="text-white">Maps by Level</h1>
    <div className="p-2 text-white text-center">
      {models.map((model, i) =>
        <MapButton scene={navigator} navigator={navigator} model={model} title={`Level ${i + 1}`} onClick={onPlay} />)}
    </div>
  </div>
}