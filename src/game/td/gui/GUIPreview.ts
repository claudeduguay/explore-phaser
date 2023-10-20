import { Scene } from "phaser";

export default class GUIPreview extends Scene {
  constructor(public main: Scene, public x: number = 0, public y: number = x) {
    super({ key: "gui_preview" })
  }

  create() {
    const vBox = 220
    const hBox = 170
    const g = this.add.graphics()
    g.fillStyle(0x111111, 1.0)
    g.lineStyle(2, 0xFFFFFF, 1.0)
    g.fillRoundedRect(this.x, this.y, hBox * 6, vBox * 3 + 20)
    g.strokeRoundedRect(this.x, this.y, hBox * 6, vBox * 3 + 20)
    this.add.existing(g)

    this.add.button(150, 100, 150, 36, "Test Button", () => console.log("Button clicked"))

  }
}
