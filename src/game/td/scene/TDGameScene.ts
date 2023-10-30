
import { Scene } from "phaser"
import TDHomeScene from "./TDHomeScene"
import TDPlayScene from "./TDPlayScene"
import TDWinScene from "./TDWinScene"
import TDLoseScene from "./TDLoseScene"
import TDMapsScene from "./TDLevelScene"
import TDOptionsScene from "./TDOptionsScene"
import preloadAssets from "./PreloadAssets"
import TDAboutScene from "./TDAboutScene"

export default class TDGameScene extends Scene {

  capture!: string

  preload() {
    preloadAssets(this)
  }

  create() {
    this.sound.setMute(true)

    this.scene.add("home", new TDHomeScene(this), true)
    this.scene.add("about", new TDAboutScene(this))
    this.scene.add("options", new TDOptionsScene(this))
    this.scene.add("maps", new TDMapsScene(this))
    this.scene.add("play", new TDPlayScene(this))
    this.scene.add("win", new TDWinScene(this))
    this.scene.add("lose", new TDLoseScene(this))
  }
}
