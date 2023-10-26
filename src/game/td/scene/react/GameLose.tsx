import { sceneSize } from "../../../../util/SceneUtil"
import ClickButton from "./buttons/ClickButton"
import INavigator from "./INavigator"

export interface IGameLoseProps {
  navigator: INavigator
}

export default function GameLose({ navigator }: IGameLoseProps) {
  const { w, h } = sceneSize(navigator)
  const onReplay = () => navigator.transitionTo("play", "lose")
  const onHome = () => navigator.transitionTo("home")
  return <div className="d-flex justify-content-center align-items-center" style={{ width: w, height: h, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1 style={{ fontSize: 96 }}>You lost!</h1>
        <p className="p-2">Keep practicing. You'll almost certainly do better next time.</p>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onReplay}>Replay</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onHome}>Main Menu</ClickButton>
      </div>
    </div>
  </div>
}