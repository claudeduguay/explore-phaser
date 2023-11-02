import { Scene } from "phaser";
import IconButton from "../gui/IconButton";
import TDInfoBase from "./TDInfoBase";
import { CHANGED_EVENT } from "../value/ObservableValue";
import TDEnemy from "../entity/enemy/TDEnemy";
import IEnemyModel from "../entity/model/IEnemyModel";
import SelectableGroup from "./SelectableGroup";

export default class TDInfoEnemy extends TDInfoBase {

  enemy?: TDEnemy

  constructor(scene: Scene, x: number, y: number,
    public group: SelectableGroup<TDEnemy>) {
    super(scene, x, y, 350, 550)

    group.selected.addListener(CHANGED_EVENT, this.setEnemy)
    group.infoVisible.addListener(CHANGED_EVENT, this.setVisibility)

    this.setEnemy(group.selected.value)
    this.setVisibility(group.infoVisible.value)
  }

  protected preDestroy(): void {
    this.group.selected.removeListener(CHANGED_EVENT, this.setEnemy)
    this.group.infoVisible.removeListener(CHANGED_EVENT, this.setVisibility)
  }

  setVisibility = (visible: boolean) => {
    if (this.visible === visible) {
      return
    }
    if (!visible) {
      this.scene.tweens.add({
        targets: this,
        x: -450,
        ease: 'Linear',
        duration: 400,
        onComplete: () => this.visible = visible
      })
    } else {
      this.visible = visible
      this.scene.tweens.add({
        targets: this,
        x: 50,
        ease: 'Linear',
        duration: 400
      })
    }
  }

  setEnemy = (enemy?: TDEnemy) => {
    this.enemy = enemy
    this.setModel(enemy?.model)
  }

  setModel = (model?: IEnemyModel) => {

    this.clear()
    const close = new IconButton(this.scene, 330, 20, 25, 25, 0xe5cd)
    close.onClick = () => this.group.infoVisible.value = false
    this.add(close)
    this.addText(30, "Enemy Info", 30, "orange")

    if (!model) {
      return
    }

    const enemy = new TDEnemy(this.scene, 350 / 2, 80, model)
    enemy.anims.play(`east-${model.key}`)  // Doesn't appear to play animation
    this.add(enemy)
    this.addText(130, `${model.name} Enemy`, 20, "white")

    this.addTable(180, "General", model.general)
    this.addTable(405, "Vulnerability (dps multiplier)", model.vulnerability)
  }

  preUpdate(time: number, delta: number) {
    // TODO: Show current effects being applied to this enemy
    this.enemy?.effects.forEach((effect: any) => {
      console.log(effect.name)
    })
  }
}
