
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import TowerInfo from "./react/TowerInfo"
import ITowerModel from "../model/ITowerModel"

export default class TDHomeScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "tower" })
  }

  create() {
    const model: ITowerModel = {
      name: "Lazer Tower",
      stats: {
        range: 150,
        emitters: 3
      },
      damage: {
        lazer: 100,
        bullet: 0,
        missile: 0,
        fire: 0,
        lightning: 0,
        poison: 0,
      }
    }
    addReactNode(this, <TowerInfo capture={this.gameScene.capture} navigator={this.gameScene} model={model} />, 25, 75)
  }
}
