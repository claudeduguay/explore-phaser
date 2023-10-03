
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameHome from "./react/GameHome"

export default class TDHomeScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "home" })
  }

  create() {
    addReactNode(this, 0, 0, <GameHome navigator={this.gameScene} />)
  }
}
