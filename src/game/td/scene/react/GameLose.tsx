import INavigator from "./INavigator"

export interface IGameLoseProps {
  navigator: INavigator
}

export default function GameLose({ navigator }: IGameLoseProps) {
  const onReplay = () => navigator.transitionTo("play", "lose")
  const onHome = () => navigator.transitionTo("home")
  return <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1>You lost!</h1>
        <p className="p-2">Keep practicing. You'll almost certainly do better next time.</p>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={onReplay}>Replay</button>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={onHome}>Main Menu</button>
      </div>
    </div>
  </div>
}