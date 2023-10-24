import { Scene } from "phaser";
import IconLabel from "../IconLabel";
import ObservableValue from "../../value/ObservableValue";

export default class ValueMonitor extends IconLabel {
  constructor(scene: Scene, x: number, y: number,
    icon: string | number, iconColor = "red",
    public readonly observable: ObservableValue<number>) {
    super(scene, x, y, icon, "", iconColor)
    observable.addListener("changed", (value: number) => this.label.text = `${value}`)
    this.label.text = `${observable.value}`
  }
}
