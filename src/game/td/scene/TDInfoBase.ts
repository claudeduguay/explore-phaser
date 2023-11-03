import { GameObjects, Scene } from "phaser";
import Panel from "../gui/Panel";
import { DEFAULT_FONT_FAMILY } from "../gui/Label";
import { entitle } from "../../../util/TextUtil"
import Button from "../gui/Button";

export interface IUpgrade {
  [key: string]: { text: string, delta?: (value: number) => number, cost: number }
}

export type IValueFormatter = (key: string, value: any) => string

export default class TDInfoBase extends Panel {

  constructor(scene: Scene, x: number, y: number, w: number, h: number) {
    super(scene, x, y, w, h, "dark")
  }

  clear() {
    // Filter out background and remove all other children
    this.remove(this.list?.filter(child => child !== this.background), true)
  }

  addTable(y: number, title: string, obj: { [key: string]: any },
    valueFormatter?: IValueFormatter, buttonFormatter?: IValueFormatter) {
    const titleObjects = this.addTitle(y, title)
    const objects: GameObjects.GameObject[] = [...titleObjects]
    Object.entries(obj).forEach(([key, value], i) => {
      const ry = (y + 40) + i * 32
      const valueText = valueFormatter ? valueFormatter(key, value) : value
      const buttonText = buttonFormatter ? buttonFormatter(key, value) : undefined
      const row = this.addRow(ry, entitle(key), valueText, buttonText)
      objects.push(...row)
    })
    return objects
  }

  addRow(y: number, key: string, value: any, buttonText?: string) {
    const field = this.addText(y, `${key}: `, 18, "cyan").setOrigin(1, 0.5)
    const content = this.addText(y, `${value}`, 18, "#66CC66").setOrigin(0, 0.5)
    const objects: GameObjects.GameObject[] = [field, content]
    if (buttonText) {
      const button = new Button(this.scene, 280, y, 110, 24, buttonText, "flat")
      this.add(button)
      objects.push(button)
    }
    return objects
  }

  addTitle(y: number, title: string): GameObjects.GameObject[] {
    const text = this.addText(y, title, 20, "orange")
    const line = new GameObjects.Line(this.scene, 350 / 2, y + 20, 0, 0, 350, 0, 0x666666)
    this.add(line)
    return [text, line]
  }

  addText(y: number, text: string, fontSize: number, color: string, x = this.width / 2, align = "center") {
    const component = this.scene.add.text(x, y, text, {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize,
      align,
      color,
      lineSpacing: 3,
      wordWrap: {
        width: 320
      }
    }).setOrigin(0.5)
    this.add(component)
    return component
  }

}
