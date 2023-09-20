import INavigator from "./INavigator"

export interface IGameWinProps {
  navigator: INavigator
}

export default function GameWin({ navigator }: IGameWinProps) {
  const onReplay = () => navigator.transitionTo("play", "win")
  const onHome = () => navigator.transitionTo("home", "win")
  return <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1>You Win!</h1>
        <p className="p-2">Nice work! You successfully completed this level.</p>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={onReplay}>Replay</button>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={() => console.log("Click")}>Continue</button>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={onHome}>Main Menu</button>
      </div>
    </div>
  </div>
}