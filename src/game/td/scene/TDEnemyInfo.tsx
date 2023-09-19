
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import EnemyInfo from "./react/EnemyInfo"
import IEnemyModel from "../model/IEnemyModel"

export default class TDEnemyScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "enemy" })
  }

  create() {
    const model: IEnemyModel = {
      name: "Generic Enemy",
      stats: {
        health: 100,
        speed: 100
      },
      damage: {
        lazer: 1,
        bullet: 1,
        missile: 1,
        fire: 1,
        lightning: 1,
        poison: 1
      }
    }
    addReactNode(this, <EnemyInfo navigator={this.gameScene} model={model} />, 1100 - 350 - 25, 75)
  }
}
