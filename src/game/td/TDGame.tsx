
import { Scene } from "phaser"
import TDHomeScene from "./TDHomeScene"
import TDScene from "./TDScene"

export default class TDGame extends Scene {

  create() {
    this.scene.add("home", new TDHomeScene(this))
    this.scene.add("game", new TDScene(this), true)
  }

  update(time: number, delta: number): void {
  }
}
