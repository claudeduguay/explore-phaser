
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGame from "../TDGame"

export default class TDLoseScene extends Scene {
  constructor(public readonly parent: TDGame) {
    super({ key: "lose" })
  }

  create() {

    const onReplay = () => this.parent.transitionTo("play", "lose")
    const onHome = () => this.parent.transitionTo("home")

    addReactNode(this,
      <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
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
      </div>,
      0, 0)
  }
}
