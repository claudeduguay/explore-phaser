
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import EnemyInfo from "./react/EnemyInfo"
import IEnemyModel, { WEAK_ENEMY } from "../model/IEnemyModel"

export default class TDEnemyScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "enemy" })
  }

  create() {
    const model: IEnemyModel = WEAK_ENEMY
    addReactNode(this, <EnemyInfo navigator={this.gameScene} model={model} />, 1100 - 350 - 25, 75)
  }
}
