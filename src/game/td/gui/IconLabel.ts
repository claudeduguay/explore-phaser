import { GameObjects, Scene } from "phaser";
import { Icon } from "./Icon";
import { Label } from "./Label";

export default class IconLabel extends GameObjects.Container {
  icon: Icon
  label: Label

  constructor(scene: Scene, x: number, y: number, public iconCode: string | number, public labelText: string, iconColor = "red") {
    super(scene, x, y)
    const g = scene.add.graphics()
    g.fillStyle(0x000000, 0.5)
    g.fillRect(0, 0, 100, 35)
    this.add(g)
    this.icon = scene.add.icon(0, 2, iconCode, { color: iconColor, fontSize: 26, align: "right" })
    this.add(this.icon)
    this.label = scene.add.label(36, 0, labelText)
    this.add(this.label)
  }
}
