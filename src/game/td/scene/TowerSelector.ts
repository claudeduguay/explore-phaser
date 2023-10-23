import { GameObjects, Scene } from "phaser";
import TowerSelectorBar from "./TowerSelectorBar";
import { TOWER_GROUPS } from "../entity/model/ITowerModel";
import Button from "../gui/Button";

export default class TowerSelector extends GameObjects.Container {
  button: Button
  bar: TowerSelectorBar
  isOpen = false

  constructor(scene: Scene, x: number, y: number, public type: string) {
    super(scene, x, y)
    this.bar = new TowerSelectorBar(scene, 30, 0, TOWER_GROUPS[type])
    this.add(this.bar)
    this.button = new Button(scene, 15, 0, 80, 30, type, "flat", this.onToggle)
    this.button.angle = 270
    this.add(this.button)
    this.bar.x = this.button.getBounds().width - this.bar.getBounds().width
  }

  onToggle = () => {
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.scene.add.tween({
        targets: this.bar,
        x: 0,
        duration: 500
      })
      this.scene.add.tween({
        targets: this.button,
        x: this.bar.models.length * 80 + this.button.getBounds().width / 2,
        angle: 90,
        duration: 500
      })
    } else {
      this.scene.add.tween({
        targets: this.bar,
        x: this.button.getBounds().width - this.bar.getBounds().width,
        duration: 500
      })
      this.scene.add.tween({
        targets: this.button,
        x: 15,
        angle: 270,
        duration: 500
      })
    }
  }
}
