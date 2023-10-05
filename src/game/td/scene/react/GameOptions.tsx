import { useState } from "react"
import ClickButton from "./buttons/ClickButton"
import INavigator from "./INavigator"
import { canvasSize } from "../../../../util/SceneUtil"

export interface IGameOptionsProps {
  navigator: INavigator
}

export default function GameOptions({ navigator }: IGameOptionsProps) {
  const { w, h } = canvasSize(navigator)
  const [muted, setMuted] = useState<boolean>(navigator.mute)
  const onHome = () => {
    navigator.transitionTo("home", "options")
  }
  const onMute = () => {
    navigator.mute = !navigator.mute
    setMuted(navigator.mute)
  }
  return <div className="d-flex justify-content-center align-items-center" style={{ width: w, height: h, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1>Game Options</h1>
        <p className="p-2">You can change settings on this screen.</p>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onMute}>
          Toggle Mute ({muted ? "muted" : "not muted"})
        </ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onHome}>Home</ClickButton>
      </div>
    </div>
  </div>
}
