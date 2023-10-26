
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameLose from "./react/GameLose"

export default class TDLoseScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super("lose")
  }

  create() {
    addReactNode(this, <GameLose navigator={this.main} />, 0, 0)
  }
}
