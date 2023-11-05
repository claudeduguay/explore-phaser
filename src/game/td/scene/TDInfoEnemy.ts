import { GameObjects, Scene } from "phaser";
import IconButton from "../gui/IconButton";
import TDInfoBase from "./TDInfoBase";
import { CHANGED_EVENT } from "../value/ObservableValue";
import TDEnemy from "../entity/enemy/TDEnemy";
import IEnemyModel from "../entity/model/IEnemyModel";
import SelectableGroup from "./SelectableGroup";
import { TOWER_INDEX, effectFormatter } from "../entity/model/ITowerModel";

export default class TDInfoEnemy extends TDInfoBase {

  enemy?: TDEnemy

  constructor(scene: Scene, x: number, y: number,
    public group: SelectableGroup<TDEnemy>) {
    super(scene, x, y, 350, 650)

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

    this.effectTableObjects = [this.addText(500, "No Damage Effects", 20, "orange")]
  }

  // Track objects added by the Effect table for later removal
  effectTableObjects: GameObjects.GameObject[] = []
  // Track previous effect list for difference determination
  previousEffects: any[] = []

  preUpdate(time: number, delta: number) {
    if (this.enemy) {
      console.log("Tangent:", this.enemy.direction)
      const effects = [...this.enemy.effects]
      if (this.previousEffects) {
        // Note: This may be a bit expensive, maybe there's a better way to detect changes 
        // OR: This optimization (to avoid repainting the table) is not actually worth it
        // OBSERVATION: These lists will always be short as only so many towers can be in 
        // proximity or having applied timeout effects, only for a short period.
        const removed = this.previousEffects.filter(e => !effects.includes(e))
        const added = effects.filter(e => !this.previousEffects.includes(e))
        if (removed.length === 0 && added.length === 0) {
          return
        }
      }
      this.previousEffects = effects
      this.effectTableObjects.forEach(o => o.destroy())
      const obj: Record<string, string> = {}
      effects.forEach((e: any) => {
        const damage = TOWER_INDEX[e.name.toLowerCase()].damage.health
        obj[e.name] = effectFormatter("", damage)
      })
      // console.log("Effects:", effects.length ? JSON.stringify(obj) : "None")
      if (Object.keys(obj).length > 0) {
        this.effectTableObjects = this.addTable(500, "Applied Effects", obj)
      } else {
        this.effectTableObjects = [this.addText(500, "No Current Effects", 20, "orange")]
      }
    }
  }
}
