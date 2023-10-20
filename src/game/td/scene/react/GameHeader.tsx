import { Scene } from "phaser"
import { sceneSize } from "../../../../util/SceneUtil"
import { useObservableValue } from "../../value/ObservableValue"
import { IActiveValues } from "../TDPlayScene"
import INavigator from "./INavigator"
import Icon from "./Icon"
import IconButton from "./buttons/IconButton"
import SpeedControl from "./SpeedControl"

export interface IGameHeaderProps {
  scene: Scene
  navigator: INavigator
  onToggleTowerPreview: () => void
  onToggleTreePreview: () => void
  onToggleGUIPreview: () => void
  active: IActiveValues
}

export default function GameHeader({ active, navigator, scene, onToggleTowerPreview, onToggleTreePreview, onToggleGUIPreview }: IGameHeaderProps) {
  const { w } = sceneSize(navigator)

  const { health: activeHealth, credits: activeCredits } = active
  const onHome = () => navigator.transitionTo("home", "game")
  const onWin = () => {
    const scene = navigator.transitionTo("win", "game")
    if (scene.sound.get("win")) {
      scene.sound.play("win")
    }
  }
  const onLose = () => {
    const scene = navigator.transitionTo("lose", "game")
    if (scene.sound.get("lose")) {
      scene.sound.play("lose")
    }
  }
  const health = useObservableValue(activeHealth)
  const credits = useObservableValue(activeCredits)

  return <div className="d-flex p-1 px-2" style={{ width: w, height: 45 }}>
    <div className="flex-fill justify-content-start">
      <div className="row">
        <div className="col-auto p-0 ms-2">
          <div className="input-group">
            <span className="input-group-text fw-bold">
              <Icon icon="favorite" style={{ color: "red", fontSize: 22 }} />
            </span>
            <span className="btn btn-success">{health}</span>
          </div>
        </div>
        <div className="col-auto p-0 ms-2">
          <div className="input-group">
            <span className="input-group-text fw-bold">
              <Icon icon="attach_money" style={{ color: "green", fontSize: 22 }} />
            </span>
            <span className="btn btn-success">{credits}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="justify-content-end">
      <div className="btn-group me-2">
        <SpeedControl scene={scene} />
      </div>
      <div className="btn-group">
        <IconButton icon="home" onClick={onHome} />
        <IconButton icon="sentiment_satisfied" onClick={onWin} />
        <IconButton icon="sentiment_very_dissatisfied" onClick={onLose} />
        <IconButton icon="verified_user" onClick={onToggleTowerPreview} />
        <IconButton icon="science" onClick={onToggleTreePreview} />
        <IconButton icon="domain_verification" onClick={onToggleGUIPreview} />
      </div>
    </div>
  </div>
}
