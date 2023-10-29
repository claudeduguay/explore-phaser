import { Scene } from "phaser"
import { sceneSize, transitionTo } from "../../../../util/SceneUtil"
import ClickButton from "./buttons/ClickButton"
import INavigator from "./INavigator"

export interface IGameWinProps {
  scene: Scene
  navigator: INavigator
}

export default function GameWin({ scene, navigator }: IGameWinProps) {
  const { w, h } = sceneSize(navigator)
  const onReplay = () => transitionTo(scene, "play")
  const onHome = () => transitionTo(scene, "home")
  return <div className="d-flex justify-content-center align-items-center" style={{ width: w, height: h, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1 style={{ fontSize: 96 }}>You Win!</h1>
        <p className="p-2">Nice work! You successfully completed this level.</p>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onReplay}>Replay</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Click")}>Continue</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onHome}>Main Menu</ClickButton>
      </div>
    </div>
  </div>
}
