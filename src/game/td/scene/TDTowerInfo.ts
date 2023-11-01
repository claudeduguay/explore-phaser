import { GameObjects, Scene } from "phaser";
import Panel from "../gui/Panel";
import { DEFAULT_FONT_FAMILY } from "../gui/Label";
import ITowerModel, { ITowerDamage, TOWER_INDEX } from "../entity/model/ITowerModel";
import TDTower, { PreviewType } from "../entity/tower/TDTower";
import { entitle } from "../../../util/TextUtil"
import Button from "../gui/Button";
import IconButton from "../gui/IconButton";

export interface IUpgrade {
  [key: string]: { text: string, delta?: (value: number) => number, cost: number }
}

export default class TDTowerInfo extends Panel {

  constructor(scene: Scene, x: number, y: number, model: ITowerModel = TOWER_INDEX.fire) {
    super(scene, x, y, 350, 540, "dark")
    this.add(new IconButton(scene, 330, 20, 25, 25, 0xe5cd)) //, { color: "white", fontSize: 24 }))
    this.addText(25, "Tower Info", 30, "orange")
    const tower = new TDTower(scene, 350 / 2, 90, model, PreviewType.Drag)
    this.add(tower)
    this.addText(147, model.name, 22, "white")
    this.addText(180, `(${entitle(model.group)})`, 14, "white")
    this.addText(225, model.description, 14, "white")

    const upgrade: IUpgrade = {
      level: { text: "+1", cost: 200 },
      cost: { text: "-10%", cost: 100 },
      range: { text: "+10%", cost: 50 },
    }
    const damageFormatter = (damage: ITowerDamage) => {
      let dps
      if (Array.isArray(damage.dps)) {
        const [min, max] = damage.dps
        dps = `${min}-${max}`
      } else {
        dps = `${damage.dps}`
      }
      const duration = damage.duration !== undefined ? `${damage.duration}ms` : "in-range"
      return `${dps} (${duration})`
    }

    this.addTitle("General", 270)
    Object.entries(model.stats).forEach(([key, value], i) => {
      const y = 315 + i * 38
      this.addRow(y, entitle(key), value, `${upgrade[key].text} ($${upgrade[key].cost})`)
    })

    this.addTitle("Damage (dps per level)", 440)
    Object.entries(model.damage).forEach(([key, value], i) => {
      const y = 482 + i * 35
      this.addRow(y, entitle(key), damageFormatter(value))
    })
  }

  addRow(y: number, key: string, value: any, buttonText?: string) {
    this.addText(y, `${key}: `, 18, "cyan").setOrigin(1, 0.5)
    this.addText(y, `${value}`, 18, "#66CC66").setOrigin(0, 0.5)
    if (buttonText) {
      this.add(new Button(this.scene, 280, y, 110, 16, buttonText, "green"))
    }
  }

  addTitle(title: string, top: number) {
    this.addText(top, "General", 22, "orange")
    this.add(new GameObjects.Line(this.scene, 350 / 2, top + 20, 0, 0, 350, 0, 0x666666))
  }

  addText(top: number, text: string, fontSize: number, color: string) {
    const component = this.scene.add.text(this.width / 2, top, text, {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize,
      align: "center",
      color,
      lineSpacing: 3,
      wordWrap: {
        width: 300
      }
    }).setOrigin(0.5)
    this.add(component)
    return component
  }

}
