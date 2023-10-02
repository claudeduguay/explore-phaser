
import { Scene } from "phaser"
import TDHomeScene from "./TDHomeScene"
import TDPlayScene from "./TDPlayScene"
import TDWinScene from "./TDWinScene"
import TDLoseScene from "./TDLoseScene"
import TDEnemyInfo from "./TDEnemyInfo"
import INavigator from "./react/INavigator"

export default class TDGameScene extends Scene implements INavigator {

  capture!: string

  preload() {
    this.load.audio('click', "assets/audio/click3.ogg")
  }

  create() {
    this.mute = true

    this.scene.add("home", new TDHomeScene(this), true)
    this.scene.add("play", new TDPlayScene(this))
    this.scene.add("win", new TDWinScene(this))
    this.scene.add("lose", new TDLoseScene(this))
    this.scene.add("enemy", new TDEnemyInfo(this))
  }

  play(key: string) {
    this.sound.play(key)
  }

  get mute() {
    return this.sound.mute
  }

  set mute(value: boolean) {
    this.sound.mute = value
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
