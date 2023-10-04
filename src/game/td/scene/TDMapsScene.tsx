
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameMaps from "./react/GameMaps"

// @ts-ignore
export default class TDMapsScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super({ key: "maps" })
  }

  create() {
    addReactNode(this, 0, 0, <GameMaps navigator={this.main} />)
  }
}
