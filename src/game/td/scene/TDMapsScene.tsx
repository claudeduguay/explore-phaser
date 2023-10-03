
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameMaps from "./react/GameMaps"

export default class TDMapsScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "maps" })
  }

  create() {
    addReactNode(this, 0, 0, <GameMaps navigator={this.gameScene} />)
  }
}
