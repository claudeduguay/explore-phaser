import { useActiveValue } from "../../value/ActiveValue"
import { IActiveValues } from "../TDPlayScene"
import INavigator from "./INavigator"
import Icon from "./Icon"
import IconButton from "./IconButton"

export interface IGameHeaderProps {
  navigator: INavigator
  onShowTowerInfo?: () => void
  active: IActiveValues
}

export default function GameHeader({ active, navigator, onShowTowerInfo }: IGameHeaderProps) {
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
  const onEnemy = () => navigator.transitionTo("enemy", "game")
  const health = useActiveValue(activeHealth)
  const credits = useActiveValue(activeCredits)

  return <div className="d-flex p-2" style={{ width: 1100, height: 60 }}>
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
        <IconButton icon="home" onClick={onHome} />
        <IconButton icon="sentiment_satisfied" onClick={onWin} />
        <IconButton icon="sentiment_very_dissatisfied" onClick={onLose} />
        {onShowTowerInfo && <IconButton icon="crop_square" onClick={onShowTowerInfo} />}
        <IconButton icon="circle" onClick={onEnemy} />
      </div>
    </div>
  </div>
}
