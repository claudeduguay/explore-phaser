import INavigator from "./INavigator"
import Icon from "./Icon"
import IconButton from "./IconButton"

export interface IGameHeaderProps {
  navigator: INavigator
  onShowTowerInfo: () => void
}

export default function GameHeader({ navigator, onShowTowerInfo }: IGameHeaderProps) {
  const onHome = () => navigator.transitionTo("home", "game")
  const onWin = () => navigator.transitionTo("win", "game")
  const onLose = () => navigator.transitionTo("lose", "game")
  // const onTower = () => navigator.transitionTo("tower", "game")
  const onEnemy = () => navigator.transitionTo("enemy", "game")

  return <div className="d-flex p-2" style={{ width: 1100, height: 60 }}>
    <div className="flex-fill justify-content-start">
      <div className="row">
        <div className="col-auto p-0 ms-2">
          <div className="input-group">
            <span className="input-group-text fw-bold">
              <Icon icon="favorite" style={{ color: "red", fontSize: 22 }} />
            </span>
            <span className="btn btn-success">100</span>
          </div>
        </div>
        <div className="col-auto p-0 ms-2">
          <div className="input-group">
            <span className="input-group-text fw-bold">
              <Icon icon="attach_money" style={{ color: "green", fontSize: 22 }} />
            </span>
            <span className="btn btn-success">25</span>
          </div>
        </div>
      </div>
    </div>
    <div className="justify-content-end bg-primary">
      <div className="btn-group">
        <IconButton icon="home" onClick={onHome} />
        <IconButton icon="sentiment_satisfied" onClick={onWin} />
        <IconButton icon="sentiment_very_dissatisfied" onClick={onLose} />
        <IconButton icon="crop_square" onClick={onShowTowerInfo} />
        <IconButton icon="circle" onClick={onEnemy} />
      </div>
    </div>
  </div>
}
