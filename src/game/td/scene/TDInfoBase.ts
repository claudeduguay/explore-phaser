import { GameObjects, Scene } from "phaser";
import Panel from "../gui/Panel";
import { DEFAULT_FONT_FAMILY } from "../gui/Label";
import Button from "../gui/Button";

export interface IUpgrade {
  [key: string]: { text: string, delta?: (value: number) => number, cost: number }
}

export default class TDInfoBase extends Panel {

  constructor(scene: Scene, x: number, y: number, w: number, h: number) {
    super(scene, x, y, w, h, "dark")
  }

  clear() {
    // Filter out background and remove all other children
    this.remove(this.list?.filter(child => child !== this.background), true)
  }

  addRow(y: number, key: string, value: any, buttonText?: string) {
    this.addText(y, `${key}: `, 18, "cyan").setOrigin(1, 0.5)
    this.addText(y, `${value}`, 18, "#66CC66").setOrigin(0, 0.5)
    if (buttonText) {
      this.add(new Button(this.scene, 280, y, 110, 24, buttonText, "flat"))
    }
  }

  addTitle(y: number, title: string) {
    this.addText(y, title, 20, "orange")
    this.add(new GameObjects.Line(this.scene, 350 / 2, y + 20, 0, 0, 350, 0, 0x666666))
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
