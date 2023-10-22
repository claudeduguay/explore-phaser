import { Scene } from "phaser";
import LayoutContainer from "./layout/LayoutContainer";
import { HBoxLayout, VBoxLayout } from "./layout/ILayout";
import Point from "../../../util/geom/Point";
import TDTower from "../entity/tower/TDTower";
import { TOWER_LIST } from "../entity/model/ITowerModel";

export default class GUIPreview extends Scene {
  constructor(public main: Scene, public x: number = 0, public y: number = x) {
    super({ key: "gui_preview" })
  }

  create() {

    const g = this.add.graphics()
    g.fillStyle(0x111111, 1.0)
    g.lineStyle(2, 0xFFFFFF, 1.0)
    g.fillRoundedRect(this.x, this.y, 1000, 680)
    g.strokeRoundedRect(this.x, this.y, 1000, 680)
    this.add.existing(g)

    const hBox: LayoutContainer = this.add.layout(150, 100, new HBoxLayout(new Point(10, 10)))
    hBox.add(this.add.icon(0, 0, 0xe87d))
    hBox.add(this.add.label(0, 0, "HBox"))
    for (let i = 0; i < 4; i++) {
      hBox.add(this.add.button(0, 0, 160, 36, `Test Button ${i + 1}`, "blue", () => console.log(`Button ${i + 1} clicked`)))
    }

    const vBox = this.add.layout(150, 220, new VBoxLayout(new Point(10, 10)))
    vBox.add(this.add.icon(0, 0, 0xe87d))
    vBox.add(this.add.label(0, 0, "VBox Layout"))
    for (let i = 0; i < 4; i++) {
      vBox.add(this.add.button(0, 0, 160, 36, `Test Button ${i + 1}`, "blue", () => console.log(`Button ${i + 1} clicked`)))
    }
    const flat = this.add.button(0, 0, 100, 100, ``, "flat", () => console.log(`Tower Button clicked`))
    const tower = new TDTower(this, 0, 0, TOWER_LIST[0], true)
    tower.platform.removeInteractive()
    tower.preview = true
    flat.add(tower)
    vBox.add(flat)
  }
}
