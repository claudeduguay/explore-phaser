import { GameObjects, Scene } from "phaser";
import Panel from "../gui/Panel";
import { DEFAULT_FONT_FAMILY } from "../gui/Label";
import ITowerModel, { TOWER_INDEX } from "../entity/model/ITowerModel";
import TDTower, { PreviewType } from "../entity/tower/TDTower";
import { entitle } from "../../../util/TextUtil"
import Button from "../gui/Button";
import IconButton from "../gui/IconButton";

export interface IUpgrade {
  [key: string]: { text: string, delta?: (value: number) => number, cost: number }
}

export default class TDTowerInfo extends Panel {

  constructor(scene: Scene, x: number, y: number, model: ITowerModel = TOWER_INDEX.fire) {
    super(scene, x, y, 350, 535, "blue")
    this.add(new IconButton(scene, 330, 20, 25, 25, 0xe5cd)) //, { color: "white", fontSize: 24 }))
    this.addText("Tower Info", 25, 30, "orange")
    const tower = new TDTower(scene, 350 / 2, 90, model, PreviewType.Drag)
    this.add(tower)
    this.addText(model.name, 147, 22, "white")
    this.addText(`(${entitle(model.group)})`, 180, 14, "white")
    this.addText(model.description, 225, 14, "white")
    this.addText("General", 270, 22, "orange")
    this.add(new GameObjects.Line(scene, 350 / 2, 290, 0, 0, 350, 0, 0x666666))
    const upgrade: IUpgrade = {
      level: { text: "+1", cost: 200 },
      cost: { text: "-10%", cost: 100 },
      range: { text: "+10%", cost: 50 },
    }
    Object.entries(model.stats).forEach(([key, value], i) => {
      const y = 315 + i * 38
      this.addText(`${entitle(key)}: `, y, 18, "cyan").setOrigin(1, 0.5)
      this.addText(` ${value} `, y, 18, "#66CC66").setOrigin(0, 0.5)
      const upgradeText = `${upgrade[key].text} ($${upgrade[key].cost})`
      this.add(new Button(scene, 280, y, 110, 16, upgradeText, "green"))
    })

    this.addText("Damage (dps per level)", 440, 22, "orange")
    this.add(new GameObjects.Line(scene, 350 / 2, 460, 0, 0, 350, 0, 0x666666))
    Object.entries(model.damage).forEach(([key, value], i) => {
      const y = 480 + i * 30
      this.addText(`${entitle(key)}: `, y, 18, "cyan").setOrigin(1, 0.5)
      Object.entries(value).forEach(([k, v]) =>
        this.addText(`${v.dps} ${entitle(k)} ${v.duration ? "(" + v.duration + "ms)" : ""} `, y, 18, "#66CC66").setOrigin(0, 0.5))
    })
  }

  addText(title: string, top: number, fontSize: number, color: string) {
    const text = this.scene.add.text(this.width / 2, top, title, {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize,
      align: "center",
      color,
      lineSpacing: 3,
      wordWrap: {
        width: 300
      }
    }).setOrigin(0.5)
    this.add(text)
    return text
  }

}
