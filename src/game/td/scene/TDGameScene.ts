
import { Scene } from "phaser"
import TDHomeScene from "./TDHomeScene"
import TDPlayScene from "./TDPlayScene"
import TDWinScene from "./TDWinScene"
import TDLoseScene from "./TDLoseScene"
import TDEnemyInfo from "./TDEnemyInfo"

export default class TDGameScene extends Scene {

  capture!: string

  create() {
    this.scene.add("home", new TDHomeScene(this))
    this.scene.add("play", new TDPlayScene(this), true)
    this.scene.add("win", new TDWinScene(this))
    this.scene.add("lose", new TDLoseScene(this))
    this.scene.add("enemy", new TDEnemyInfo(this))
  }

  transitionTo(target: string, sleep?: string): Scene {
    // console.log(`Transition to ${target}`)
    if (sleep) {
      this.scene.sleep(sleep)
    }
    this.scene.transition({
      target,
      duration: 1000
    })
    return this
  }

  update(time: number, delta: number): void {
  }
}
