
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameLevels from "./react/GameLevels"

// @ts-ignore
export default class TDMapsScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super({ key: "maps" })
  }

  create() {
    addReactNode(this, 0, 0, <GameLevels navigator={this.main} />)
  }
}
