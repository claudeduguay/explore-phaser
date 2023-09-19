import INavigator from "./INavigator"

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
            <span className="input-group-text fw-bold">Credits ($)</span>
            <span className="btn btn-success">100</span>
          </div>
        </div>
        <div className="col-auto">
          <div className="input-group">
            <span className="input-group-text fw-bold">Remaining Enemies</span>
            <span className="btn btn-success">25</span>
          </div>
        </div>
        <div className="col-auto">
          <div className="input-group">
            <span className="input-group-text fw-bold">Placeholder</span>
            <span className="btn btn-success">0</span>
          </div>
        </div>
      </div>
    </div>
    <div className="justify-content-end bg-primary">
      <div className="btn-group">
        <button className="btn btn-primary" onClick={onHome}>Home</button>
        <button className="btn btn-primary" onClick={onWin}>Test Win</button>
        <button className="btn btn-primary" onClick={onLose}>Test Lose</button>
        <button className="btn btn-primary" onClick={onTower}>Tower</button>
        <button className="btn btn-primary" onClick={onEnemy}>Enemy</button>
      </div>
    </div>
  </div>
}
