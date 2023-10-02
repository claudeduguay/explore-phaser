import { useState } from "react"
import ClickButton from "./ClickButton"
import INavigator from "./INavigator"

export interface IGameOptionsProps {
  navigator: INavigator
}

export default function GameOptions({ navigator }: IGameOptionsProps) {
  const [muted, setMuted] = useState<boolean>(navigator.mute)
  const onHome = () => {
    navigator.transitionTo("home", "options")
  }
  const onMute = () => {
    navigator.mute = !navigator.mute
    setMuted(navigator.mute)
  }
  return <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
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
