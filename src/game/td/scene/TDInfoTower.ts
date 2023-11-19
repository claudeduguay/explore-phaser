import { Scene } from "phaser";
import ITowerModel, { effectFormatter } from "../entity/model/ITowerModel";
import TDTower, { PreviewType } from "../entity/tower/TDTower";
import { entitle } from "../../../util/TextUtil"
import IconButton from "../gui/IconButton";
import TDInfoBase from "./TDInfoBase";
import { CHANGED_EVENT } from "../value/ObservableValue";
import { sceneSize } from "../../../util/SceneUtil";
import SelectableGroup from "./SelectableGroup";

export interface IUpgrade {
  [key: string]: { text: string, cost: number, delta?: (value: number) => number }
}

export default class TDInfoTower extends TDInfoBase {

  constructor(scene: Scene, x: number, y: number,
    public group: SelectableGroup<TDTower>) {
    super(scene, x, y, 350, 550)

    group.selected.addListener(CHANGED_EVENT, this.setTower)
    group.infoVisible.addListener(CHANGED_EVENT, this.setVisibility)

    this.setTower(group.selected.value)
    this.setVisibility(group.infoVisible.value)
  }

  protected preDestroy(): void {
    this.group.selected.removeListener(CHANGED_EVENT, this.setTower)
    this.group.infoVisible.removeListener(CHANGED_EVENT, this.setVisibility)
    super.preDestroy()
  }

  setVisibility = (visible: boolean) => {
    const { w } = sceneSize(this.scene)
    if (this.visible === visible) {
      return
    }
    if (!visible) {
      this.scene.tweens.add({
        targets: this,
        x: w + 100,
        ease: 'Linear',
        duration: 400,
        onComplete: () => this.visible = visible
      })
    } else {
      this.visible = visible
      this.scene.tweens.add({
        targets: this,
        x: w - 350 - 20,
        ease: 'Linear',
        duration: 400
      })
    }
  }

  setTower = (tower?: TDTower) => {
    this.setModel(tower?.model)
  }

  setModel = (model?: ITowerModel) => {

    this.clear()
    const close = new IconButton(this.scene, 330, 20, 25, 25, 0xe5cd)
    close.onClick = () => this.group.infoVisible.value = false
    this.add(close)
    this.addText(30, "Tower Info", 30, "orange")

    if (!model) {
      return
    }

    const tower = new TDTower(this.scene, 350 / 2, 90, model, PreviewType.Drag)
    this.add(tower)
    this.addText(147, model.name, 22, "white")
    this.addText(180, `(${entitle(model.group)})`, 14, "white")
    this.addText(225, model.description, 14, "white", 18, "left").setOrigin(0, 0.5)

    const upgrade: IUpgrade = {
      level: { text: "+1", cost: 200 },
      cost: { text: "-10%", cost: 100 },
      range: { text: "+10%", cost: 50 },
    }
    const valueFormatter = (key: string, value: number) => `${value}`
    const buttonFormatter = (key: string, value: number) => `${upgrade[key].text} ($${upgrade[key].cost})`
    this.addTable(270, "General", model.general, valueFormatter, buttonFormatter)

    const damage = { damage: effectFormatter("", model.damage) }
    this.addTable(430, "Damage (dps per level)", damage)
  }
}
