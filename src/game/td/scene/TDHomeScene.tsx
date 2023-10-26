
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameHome from "./react/GameHome"

export default class TDHomeScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super("home")
  }

  create() {
    addReactNode(this, <GameHome navigator={this.main} />, 0, 0)
  }
}
