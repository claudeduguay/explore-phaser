import { Scene } from "phaser";
import ITowerModel, { ITowerDamage } from "../entity/model/ITowerModel";
import TDTower, { PreviewType } from "../entity/tower/TDTower";
import { entitle } from "../../../util/TextUtil"
import IconButton from "../gui/IconButton";
import TDInfoBase from "./TDInfoBase";
import ObservableValue, { CHANGED_EVENT } from "../value/ObservableValue";
import { sceneSize } from "../../../util/SceneUtil";

export interface IUpgrade {
  [key: string]: { text: string, cost: number, delta?: (value: number) => number }
}

export default class TDInfoTower extends TDInfoBase {

  constructor(scene: Scene, x: number, y: number,
    public towerObservable: ObservableValue<TDTower | undefined>,
    public visibleObservable: ObservableValue<boolean>) {
    super(scene, x, y, 350, 550)

    towerObservable.addListener(CHANGED_EVENT, this.setTower)
    visibleObservable.addListener(CHANGED_EVENT, this.setVisibility)

    this.setTower(towerObservable.value)
    this.setVisibility(visibleObservable.value)
  }

  protected preDestroy(): void {
    this.towerObservable.removeListener(CHANGED_EVENT, this.setTower)
    this.visibleObservable.removeListener(CHANGED_EVENT, this.setVisibility)
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
    close.onClick = () => this.visibleObservable.value = false
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

    this.addTitle(270, "General")
    Object.entries(model.general).forEach(([key, value], i) => {
      const y = 310 + i * 32
      this.addRow(y, entitle(key), value, `${upgrade[key].text} ($${upgrade[key].cost})`)
    })

    this.addTitle(430, "Damage (dps per level)")
    Object.entries(model.damage).forEach(([key, value], i) => {
      const y = 465 + i * 32
      this.addRow(y, entitle(key), damageFormatter(value))
    })
  }
}
