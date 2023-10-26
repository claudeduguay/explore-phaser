
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameWin from "./react/GameWin"

export default class TDHomeScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super("win")
  }

  create() {
    addReactNode(this, <GameWin navigator={this.main} />, 0, 0)
  }
}
