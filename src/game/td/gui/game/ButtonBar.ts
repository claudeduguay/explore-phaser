import { GameObjects } from "phaser";
import IconButton from "../IconButton";
import ILayout, { HBoxLayout } from "../layout/ILayout";
import Button from "../Button";
import TDGameScene from "../../scene/TDGameScene";
import TDHUDScene from "../../scene/TDHUDScene";

const ICON_HOME = 0xe88a
const ICON_HAPPY = 0xe813
const ICON_UNHAPPY = 0xe811
const ICON_SHIELD = 0xe8e8
const ICON_BEAKER = 0xea4b
const ICON_DIALOG = 0xef4c
const ICON_REPLAY = 0xe042

const ICONS = [
  { name: "home", icon: ICON_HOME },
  { name: "win", icon: ICON_HAPPY },
  { name: "lose", icon: ICON_UNHAPPY },
  { name: "replay", icon: ICON_REPLAY },
  { name: "towers", icon: ICON_SHIELD },
  { name: "tree", icon: ICON_BEAKER },
  { name: "gui", icon: ICON_DIALOG },
]

export default class ButtonBar extends GameObjects.Container {

  layout: ILayout
  access: { [key: string]: Button } = {}

  constructor(scene: TDHUDScene, x: number, y: number) {
    super(scene, x, y)
    ICONS.forEach((entry, i) => {
      const button = new IconButton(scene, 0, 1, 2, 2, entry.icon, "flat")
      this.access[entry.name] = button
      this.add(button)
    })
    this.layout = new HBoxLayout()
    this.layout.apply(this)

    const mainScene = scene.playScene.main as TDGameScene

    this.access.home.onClick = () => mainScene.transitionTo("home", "game")
    this.access.win.onClick = () => {
      const target = mainScene.transitionTo("win", "game")
      if (target.sound.get("win")) {
        target.sound.play("win")
      }
    }
    this.access.lose.onClick = () => {
      const target = mainScene.transitionTo("lose", "game")
      if (target.sound.get("lose")) {
        target.sound.play("lose")
      }
    }

  }
}
