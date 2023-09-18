
import { Scene, Scenes } from "phaser"
import { addReactNode } from "../../util/DOMUtil"
import TDGame from "./TDGame"

export default class TDHomeScene extends Scene {
  constructor(public readonly parent: TDGame) {
    super({ key: "home" })
  }

  create() {

    const onPlay = () => {
      console.log("Transition to Game")
      this.parent.scene.sleep("home")
      this.parent.scene.transition({
        target: "game",
        duration: 1000
      })
    }

    const dom = addReactNode(this,
      <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
        <div className="p-2 text-white container">
          <div className="p-2">
            <h1>Tower Defender</h1>
            <p className="p-2">Welcome to my first Phaser 3 project. This is a basic Tower Defense game.</p>
          </div>
          <div className="p-2">
            <button className="btn btn-primary col-4" onClick={onPlay}>Play</button>
          </div>
          <div className="p-2">
            <button className="btn btn-primary col-4" onClick={() => console.log("Click")}>Continue</button>
          </div>
          <div className="p-2">
            <button className="btn btn-primary col-4" onClick={() => console.log("Click")}>Quit</button>
          </div>
          <div className="p-2">
            <button className="btn btn-primary col-4" onClick={() => console.log("Click")}>About</button>
          </div>
        </div>
      </div>,
      0, 0)

    this.events.on(Scenes.Events.TRANSITION_WAKE, () => {
      dom.style.visibility = "visible"
    })
    this.events.on(Scenes.Events.SLEEP, () => {
      dom.style.visibility = "hidden"
    })
  }
}
