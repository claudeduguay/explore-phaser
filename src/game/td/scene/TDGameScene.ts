
import { Scene } from "phaser"
import TDHomeScene from "./TDHomeScene"
import TDScene from "./TDPlayScene"
import TDWinScene from "./TDWinScene"
import TDLoseScene from "./TDLoseScene"

export default class TDGameScene extends Scene {

  create() {
    this.scene.add("home", new TDHomeScene(this))
    this.scene.add("play", new TDScene(this), true)
    this.scene.add("win", new TDWinScene(this))
    this.scene.add("lose", new TDLoseScene(this))
  }

  transitionTo(target: string, sleep?: string) {
    console.log(`Transition to ${target}`)
    if (sleep) {
      this.scene.sleep(sleep)
    }
    this.scene.transition({
      target,
      duration: 1000
    })
  }

  update(time: number, delta: number): void {
  }
}
