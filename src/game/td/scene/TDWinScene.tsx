
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameWin from "./react/GameWin"

export default class TDHomeScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super({ key: "win" })
  }

  create() {
    addReactNode(this, 0, -800, 0, 0, <GameWin navigator={this.main} />)
  }
}
