
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TowerInfo from "./react/TowerInfo"
// import TDPlayScene from "./TDPlayScene"
import TDGameScene from "./TDGameScene"

export default class TDHomeScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "tower" })
  }

  create() {
    const play: any = this.gameScene.scene.get("play")
    addReactNode(this, <TowerInfo tower={play?.selectionManager.selected} navigator={this.gameScene} />, 25, 75)
  }
}
