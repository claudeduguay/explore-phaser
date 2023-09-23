import INavigator from "./INavigator"
import Icon from "./Icon"

export interface IGameHeaderProps {
  navigator: INavigator
}

export default function GameHeader({ navigator }: IGameHeaderProps) {
  const onHome = () => navigator.transitionTo("home", "game")
  const onWin = () => navigator.transitionTo("win", "game")
  const onLose = () => navigator.transitionTo("lose", "game")
  const onTower = () => navigator.transitionTo("tower", "game")
  const onEnemy = () => navigator.transitionTo("enemy", "game")

  return <div className="d-flex p-2" style={{ width: 1100, height: 54 }}>
    <div className="flex-fill justify-content-start">
      <div className="row">
        <div className="col-auto">
          <div className="input-group">
            <span className="input-group-text fw-bold">
              <Icon icon="favorite" style={{ color: "red", fontSize: 22 }} />
            </span>
            <span className="btn btn-success">100</span>
          </div>
        </div>
        <div className="col-auto">
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
        <button className="btn btn-primary" onClick={onHome}>
          <Icon icon="home" style={{ color: "white", fontSize: 22 }} />
        </button>
        <button className="btn btn-primary" onClick={onWin}>
          <Icon icon="sentiment_satisfied" style={{ color: "white", fontSize: 22 }} />
        </button>
        <button className="btn btn-primary" onClick={onLose}>
          <Icon icon="sentiment_very_dissatisfied" style={{ color: "white", fontSize: 22 }} />
        </button>
        <button className="btn btn-primary" onClick={onTower}>
          <Icon icon="crop_square" style={{ color: "white", fontSize: 22 }} />
        </button>
        <button className="btn btn-primary" onClick={onEnemy}>
          <Icon icon="circle" style={{ color: "white", fontSize: 22 }} />
        </button>
      </div>
    </div>
  </div>
}
