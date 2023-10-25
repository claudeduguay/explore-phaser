import { GameObjects, Scene } from "phaser";
import IconButton from "../IconButton";
import ILayout, { HBoxLayout } from "../layout/ILayout";
import Button from "../Button";
import TDGameScene from "../../scene/TDGameScene";
import TDPlayScene from "../../scene/TDPlayScene";

const ICON_HOME = 0xe88a
const ICON_HAPPY = 0xe813
const ICON_UNHAPPY = 0xe811
const ICON_SHIELD = 0xe8e8
const ICON_BEAKER = 0xea4b
const ICON_DIALOG = 0xef4c

const ICONS = [
  { name: "home", icon: ICON_HOME },
  { name: "win", icon: ICON_HAPPY },
  { name: "lose", icon: ICON_UNHAPPY },
  { name: "towers", icon: ICON_SHIELD },
  { name: "tree", icon: ICON_BEAKER },
  { name: "gui", icon: ICON_DIALOG }
]

export function transitionTo(scene: Scene, target: string, sleep?: string): Scene {
  // this.cameras.main.once("camerafadeoutcomplete", (camera: Cameras.Scene2D.Camera) => {
  //   console.log("Faded out")
  // })
  // this.cameras.main.fadeOut(1000, 0, 0, 0)
  if (sleep) {
    scene.scene.sleep(sleep)
  }
  scene.scene.transition({
    target,
    duration: 1000
  })
  // if (this.cameras.main) {
  //   this.cameras.main.fadeIn(1000)
  // }
  // console.log(`Transition to ${target}`)
  return scene
}


export default class ButtonBar extends GameObjects.Container {

  layout: ILayout
  access: { [key: string]: Button } = {}

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y)
    ICONS.forEach((entry, i) => {
      const button = new IconButton(scene, 0, 1, 20, 20, entry.icon, "flat")
      this.access[entry.name] = button
      this.add(button)

    })
    this.layout = new HBoxLayout()
    this.layout.apply(this)

    const mainScene = (scene as TDPlayScene).main as TDGameScene

    this.access.home.onClick = () => transitionTo(mainScene, "home", "game")
    this.access.win.onClick = () => {
      const target = transitionTo(mainScene, "win", "game")
      if (target.sound.get("win")) {
        target.sound.play("win")
      }
    }
    this.access.lose.onClick = () => {
      const target = transitionTo(mainScene, "lose", "game")
      if (target.sound.get("lose")) {
        target.sound.play("lose")
      }
    }

  }
}
