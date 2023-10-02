
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameOptions from "./react/GameOptions"

export default class TDOptionsScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "options" })
  }

  create() {
    addReactNode(this, <GameOptions navigator={this.gameScene} />, 0, 0)
  }
}
