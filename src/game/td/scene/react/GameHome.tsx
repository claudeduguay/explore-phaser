import { useState } from "react"
import ClickButton from "./ClickButton"
import INavigator from "./INavigator"

export interface IGameHomeProps {
  navigator: INavigator
}

export default function GameHeader({ navigator }: IGameHomeProps) {
  const [muted, setMuted] = useState<boolean>(false)
  const onPlay = () => {
    navigator.transitionTo("play", "home")
  }
  const onMaps = () => {
    navigator.transitionTo("maps", "home")
  }
  const onMute = () => {
    navigator.mute = !navigator.mute
    setMuted(v => !v)
  }
  return <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1>Tower Defender</h1>
        <p className="p-2">Welcome to my first Phaser 3 project. This is a basic Tower Defense game.</p>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onMaps}>Maps</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onPlay}>Play</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Continue")}>Continue</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Options")}>Options</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("About")}>About</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Quit")}>Quit</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onMute}>
          Toggle Mute ({muted ? "muted" : "not muted"})
        </ClickButton>
      </div>
    </div>
  </div>
}