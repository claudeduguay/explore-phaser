import { GameObjects, Scene } from "phaser";
import TowerSelectorBar from "./TowerSelectorBar";
import ITowerModel, { TOWER_GROUPS } from "../entity/model/ITowerModel";
import Button from "../gui/Button";
import ObservableValue from "../value/ObservableValue";

export function entitle(text: string) {
  return text[0].toUpperCase() + text.substring(1)
}

export default class TowerSelector extends GameObjects.Container {
  button: Button
  bar: TowerSelectorBar
  group: TowerSelector[] = []
  _isOpen = false

  constructor(scene: Scene, x: number, y: number, public credits: ObservableValue<number>,
    public machineName: string, onAddTower: (model: ITowerModel) => void) {
    super(scene, x, y)
    this.bar = new TowerSelectorBar(scene, 30, 0, this, TOWER_GROUPS[machineName], onAddTower)
    this.add(this.bar)
    this.button = new Button(scene, 15, 0, 100, 30, entitle(machineName), "flat", this.onToggle)
    this.button.angle = 270
    this.add(this.button)
    this.bar.x = this.button.getBounds().width - this.bar.getBounds().width
  }

  onToggle = () => {
    this.isOpen = !this.isOpen
  }

  get isOpen() {
    return this._isOpen
  }

  set isOpen(value: boolean) {
    if (value === this._isOpen) {
      return
    }
    if (value) {
      this.group.forEach(s => {
        if (s !== this) {
          s.isOpen = false
        }
      })
    }
    this._isOpen = value
    const duration = 500 // this.bar.models.length * 100
    if (value) {
      this.scene.add.tween({
        targets: this.bar,
        x: 0,
        duration,
        onStart: () => {
          this.bar.visible = true
        }
      })
      this.scene.add.tween({
        targets: this.button,
        x: this.bar.models.length * 100 + this.button.getBounds().width / 2,
        angle: 90,
        duration
      })
    } else {
      this.scene.add.tween({
        targets: this.bar,
        x: this.button.getBounds().width - this.bar.getBounds().width,
        duration,
        onComplete: () => {
          this.bar.visible = false
        }
      })
      this.scene.add.tween({
        targets: this.button,
        x: 15,
        angle: 270,
        duration
      })
    }
  }
}
