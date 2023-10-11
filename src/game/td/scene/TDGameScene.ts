
import { Scene } from "phaser"
import TDHomeScene from "./TDHomeScene"
import TDPlayScene from "./TDPlayScene"
import TDWinScene from "./TDWinScene"
import TDLoseScene from "./TDLoseScene"
import INavigator from "./react/INavigator"
import TDMapsScene from "./TDLevelScene"
import { makeEllipse, makePathTiles } from "../assets/TextureFactory"
import TDOptionsScene from "./TDOptionsScene"

export default class TDGameScene extends Scene implements INavigator {

  capture!: string

  preload() {
    this.load.audio('click', "assets/audio/click3.ogg")
    makePathTiles(this, "path_tiles", 64, 64)
  }

  create() {
    this.mute = true
    // console.log("Mute:", this.mute)

    this.scene.add("home", new TDHomeScene(this), true)
    this.scene.add("options", new TDOptionsScene(this))
    this.scene.add("maps", new TDMapsScene(this))
    this.scene.add("play", new TDPlayScene(this))
    this.scene.add("win", new TDWinScene(this))
    this.scene.add("lose", new TDLoseScene(this))

    // ENEMY TEXTURES
    makeEllipse(this, "path-green", 20, 20, { color: "#66FF66" })
    makeEllipse(this, "path-blue", 20, 20, { color: "#6666FF" })
    makeEllipse(this, "path-red", 20, 20, { color: "#FF6666" })

  }

  play(key: string) {
    if (this.sound.get(key)) {
      this.sound.play(key)
    }
  }

  get mute() {
    return this.sound.mute
  }

  set mute(value: boolean) {
    this.sound.setMute(value)
    // console.log("this.sound.mute=", this.sound.mute, value)
  }

  transitionTo(target: string, sleep?: string): Scene {
    // this.cameras.main.once("camerafadeoutcomplete", (camera: Cameras.Scene2D.Camera) => {
    //   console.log("Faded out")
    // })
    // this.cameras.main.fadeOut(1000, 0, 0, 0)
    if (sleep) {
      this.scene.sleep(sleep)
    }
    this.scene.transition({
      target,
      duration: 1000
    })
    // if (this.cameras.main) {
    //   this.cameras.main.fadeIn(1000)
    // }
    // console.log(`Transition to ${target}`)
    return this
  }

  update(time: number, delta: number): void {
  }
}
