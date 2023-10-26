
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameLevels from "./react/GameLevels"

// @ts-ignore
export default class TDMapsScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super("maps")
  }

  create() {
    addReactNode(this, <GameLevels navigator={this.main} />, 0, -800, 0, 0)
  }
}
