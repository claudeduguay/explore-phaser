
import { Scene } from "phaser"
import TDHomeScene from "./TDHomeScene"
import TDPlayScene from "./TDPlayScene"
import TDWinScene from "./TDWinScene"
import TDLoseScene from "./TDLoseScene"
import INavigator from "./react/INavigator"
import TDMapsScene from "./TDLevelScene"
import TDOptionsScene from "./TDOptionsScene"
import preloadAssets from "./PreloadAssets"
import { transitionTo } from "../../../util/SceneUtil"
import TDAboutScene from "./TDAboutScene"

export default class TDGameScene extends Scene implements INavigator {

  capture!: string

  preload() {
    preloadAssets(this)
  }

  create() {
    this.mute = true
    // console.log("Mute:", this.mute)

    this.scene.add("home", new TDHomeScene(this), true)
    this.scene.add("about", new TDAboutScene(this))
    this.scene.add("options", new TDOptionsScene(this))
    this.scene.add("maps", new TDMapsScene(this))
    this.scene.add("play", new TDPlayScene(this))
    this.scene.add("win", new TDWinScene(this))
    this.scene.add("lose", new TDLoseScene(this))
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

  transitionTo(target: string, sleep?: string) {
    transitionTo(this, target)
  }
}
//     // this.cameras.main.once("camerafadeoutcomplete", (camera: Cameras.Scene2D.Camera) => {
//     //   console.log("Faded out")
//     // })
//     // this.cameras.main.fadeOut(1000, 0, 0, 0)
//     if (sleep) {
//       this.scene.sleep(sleep)
//     }
//     this.scene.transition({
//       target,
//       duration: 1000
//     })
//     // if (this.cameras.main) {
//     //   this.cameras.main.fadeIn(1000)
//     // }
//     // console.log(`Transition to ${target}`)
//     return this
//   }

//   update(time: number, delta: number): void {
//   }
// }
