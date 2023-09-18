
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGame from "./TDGameScene"

export default class TDHomeScene extends Scene {
  constructor(public readonly parent: TDGame) {
    super({ key: "win" })
  }

  create() {

    const onReplay = () => this.parent.transitionTo("play", "win")
    const onHome = () => this.parent.transitionTo("home")

    addReactNode(this,
      <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
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
      </div>,
      0, 0)
  }
}
