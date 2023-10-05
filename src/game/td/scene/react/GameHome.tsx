import { canvasSize } from "../../../../util/SceneUtil"
import ClickButton from "./buttons/ClickButton"
import INavigator from "./INavigator"

export interface IGameHomeProps {
  navigator: INavigator
}

export default function GameHeader({ navigator }: IGameHomeProps) {
  const { w, h } = canvasSize(navigator)

  const onPlay = () => {
    navigator.transitionTo("play", "home")
  }
  const onLevels = () => {
    navigator.transitionTo("maps", "home")
  }
  const onOptions = () => {
    navigator.transitionTo("options", "home")
  }
  return <div className="d-flex justify-content-center align-items-center" style={{ width: w, height: h, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1>Tower Defender</h1>
        <p className="p-2">Welcome to my first Phaser 3 project. This is a basic Tower Defense game.</p>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onLevels}>Levels</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onPlay}>Play</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Continue")}>Continue</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onOptions}>Options</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("About")}>About</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Quit")}>Quit</ClickButton>
      </div>
    </div>
  </div>
}