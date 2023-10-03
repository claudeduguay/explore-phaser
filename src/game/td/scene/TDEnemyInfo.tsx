
import { Scene } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import EnemyInfo from "./react/EnemyInfo"
import IEnemyModel, { WEAK_ENEMY } from "../model/IEnemyModel"
import { canvasSize } from "../../../util/SceneUtil"

export default class TDEnemyScene extends Scene {
  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "enemy" })
  }

  create() {
    const model: IEnemyModel = WEAK_ENEMY
    const { w } = canvasSize(this)
    addReactNode(this, w - 350 - 25, 75, <EnemyInfo navigator={this.gameScene} model={model} />)
  }
}
