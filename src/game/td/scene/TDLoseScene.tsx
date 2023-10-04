
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameLose from "./react/GameLose"

export default class TDLoseScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super({ key: "lose" })
  }

  create() {
    addReactNode(this, 0, 0, <GameLose navigator={this.main} />)
  }
}
