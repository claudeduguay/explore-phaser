import { Scene } from "phaser"
import { canvasSize } from "../../../../util/SceneUtil"
import { useActiveValue } from "../../value/ActiveValue"
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
  active: IActiveValues
}

export default function GameHeader({ active, navigator, scene, onToggleTowerPreview, onToggleTreePreview }: IGameHeaderProps) {
  const { w } = canvasSize(navigator)

  const { health: activeHealth, credits: activeCredits } = active
  const onHome = () => navigator.transitionTo("home", "game")
  const onWin = () => {
    const scene = navigator.transitionTo("win", "game")
    scene.sound.play("win")
  }
  const onLose = () => {
    const scene = navigator.transitionTo("lose", "game")
    scene.sound.play("lose")
  }
  const health = useActiveValue(activeHealth)
  const credits = useActiveValue(activeCredits)

  return <>
    <div className="d-flex p-2" style={{ width: w, height: 45 }}>
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
      <div className="justify-content-end bg-primary">
        <div className="btn-group">
          <SpeedControl scene={scene} />
          <IconButton icon="home" onClick={onHome} />
          <IconButton icon="sentiment_satisfied" onClick={onWin} />
          <IconButton icon="sentiment_very_dissatisfied" onClick={onLose} />
          <IconButton icon="visibility" onClick={onToggleTowerPreview} />
          <IconButton icon="account_tree" onClick={onToggleTreePreview} />
        </div>
      </div>
    </div>
  </>
}
