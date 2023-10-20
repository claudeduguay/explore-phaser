
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameOptions from "./react/GameOptions"

export default class TDOptionsScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super({ key: "options" })
  }

  create() {
    addReactNode(this, <GameOptions navigator={this.main} />, 0, -800, 0, 0)
  }
}
