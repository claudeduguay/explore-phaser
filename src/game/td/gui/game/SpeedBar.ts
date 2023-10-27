import { GameObjects, Scene } from "phaser";
import ILayout, { HBoxLayout } from "../layout/ILayout";
import IconButton from "../IconButton";
import Button from "../Button";
import ObservableValue from "../../value/ObservableValue";
import { timeScale } from "../../../../util/TimeUtil"

const ICON_PLAY = 0xe037
const ICON_PAUSE = 0xe034
const ICON_LEFT = 0xe408
const ICON_RIGHT = 0xe409

const ICONS = [
  { name: "play", icon: ICON_PAUSE },
  { name: "slower", icon: ICON_LEFT },
  { name: "faster", icon: ICON_RIGHT }
]

export function formatSpeed(s: number) {
  switch (s) {
    case 0.5:
      return "\u00BDx"
    case 0.25:
      return `\u00BCx`
    default:
      return `${s}x`
  }
}

export default class SpeedBar extends GameObjects.Container {

  layout!: ILayout
  access: { [key: string]: Button } = {}
  pause = new ObservableValue<boolean>(false)
  speed = new ObservableValue<number>(1)

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y)
    ICONS.forEach((entry, i) => {
      if (i === 2) {
        const text = new Button(scene, 0, 1, 20, 20, "1x", "flat")
        this.access.text = text
        this.add(text)
      }
      const button = new IconButton(scene, 0, 1, 2, 2, entry.icon, "flat")
      this.access[entry.name] = button
      this.add(button)
    })

    this.access.faster.onClick = () => this.speed.value = Math.min(this.speed.value * 2, 4)
    this.access.slower.onClick = () => this.speed.value = Math.max(0.25, this.speed.value / 2)
    this.access.play.onClick = () => this.pause.value = !this.pause.value
    this.access.text.onClick = () => this.speed.value = 1
    this.pause.addListener("changed", (value: boolean) => {
      (this.access.play as IconButton).setIcon(value ? ICON_PLAY : ICON_PAUSE)
      setTimeout(() => timeScale(scene, this.pause.value ? 0 : this.speed.value), 0)
    })
    this.speed.addListener("changed", (value: number) => {
      this.access.text.setLabelText(formatSpeed(value))
      timeScale(scene, this.pause.value ? 0 : this.speed.value)
    })

    this.layout = new HBoxLayout()
    this.layout.apply(this)
  }
}
