import INavigator from "./INavigator"
import LevelButton from "./LevelButton"
import { sceneSize, transitionTo } from "../../../../util/SceneUtil"
import { ILevelModel } from "../map/ILevelModel"
import CloseButton from "./CloseButton"
import { Scene } from "phaser"

export interface IGameHomeProps {
  scene: Scene
  navigator: INavigator
  levels: ILevelModel[]
}

// TODO: Need to port to non-React view
export default function GameLevels({ scene, navigator, levels }: IGameHomeProps) {

  const onPlay = () => transitionTo(scene, "play")
  const onHome = () => transitionTo(scene, "home")

  const { w, h } = sceneSize(navigator)
  return <div className="p-1" style={{ width: w, height: h, background: "black" }} data-bs-theme="dark" >
    <CloseButton onClick={onHome} />
    <h1 className="text-white">Maps by Level</h1>
    <div className="p-2 text-white text-center">
      {levels.map((model, i) =>
        <LevelButton key={i} scene={navigator} navigator={navigator} model={model} title={`Level ${i + 1}`} onClick={onPlay} />)}
    </div>
  </div>
}
