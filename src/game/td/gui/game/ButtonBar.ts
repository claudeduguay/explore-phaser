import { GameObjects, Scene } from "phaser";
import IconButton from "../IconButton";
import ILayout, { HBoxLayout } from "../layout/ILayout";
import Button from "../Button";

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

export default class ButtonBar extends GameObjects.Container {

  layout: ILayout
  access = new Map<string, Button>()

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y)
    ICONS.forEach((entry, i) => {
      const button = new IconButton(scene, 0, 1, 20, 20, entry.icon, "flat")
      this.access.set(entry.name, button)
      this.add(button)

    })
    this.layout = new HBoxLayout()
    this.layout.apply(this)
  }
}
