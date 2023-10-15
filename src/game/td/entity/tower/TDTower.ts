
import { GameObjects, Input, Scene } from "phaser"
import TDTurret from "./TDTurret"
import BehaviorContainer from "../../behavior/core/BehaviorContainer"
import TargetAimBehavior from "../../behavior/tower/TargetAimBehavior"
import ClearTargetsBehavior from "../../behavior/tower/TargetsClearBehavior"
import TDRange from "./TDRange"
import ITowerModel from "../model/ITowerModel"
import { TOWER_INDEX } from "../model/ITowerModel"
import { ISelectable } from "../../scene/SelectableGroup"
import { clamp } from "../../../../util/MathUtil"
import Point, { toSceneCoordinates } from "../../../../util/Point"
import { addLabel } from "../../../../util/TextUtil"
import Targeting from "./Targeting"

import RotateBehavior from "../../behavior/tower/RotateBehavior"
import TargetLaserBehavior from "../../behavior/tower/TargetLazerBehavior"
import TargetPlasmaBehavior from "../../behavior/tower/TargetPlasmaBehavior"
import TargetLightningBehavior from "../../behavior/tower/TargetLightningBehavior"
import TargetFlameBehavior from "../../behavior/tower/spray/TargetFlameBehavior"
import TargetFreezeBehavior from "../../behavior/tower/spray/TargetFreezeBehavior"
import TargeForceBehavior from "../../behavior/tower/spray/TargeForceBehavior"
import TargePoisonBehavior from "../../behavior/tower/cloud/TargetPoisonBehavior"
import TargetFireBehavior from "../../behavior/tower/cloud/TargetFireBehavior"
import TargetSmokeBehavior from "../../behavior/tower/cloud/TargetSmokeBehavior"
import TargetShockBehavior from "../../behavior/tower/cloud/TargetShockBehavior"
import TargetIceBehavior from "../../behavior/tower/cloud/TargetIceBehavior"
import TargetRainBehavior from "../../behavior/tower/cloud/TargetRainBehavior"
import TargetSnowBehavior from "../../behavior/tower/cloud/TargetSnowBehavior"
import TargetBulletBehavior from "../../behavior/tower/TargetBulletBehavior"
import TargetMissileBehavior from "../../behavior/tower/TargetMissileBehavior"
import TargetBoostBehavior from "../../behavior/tower/TargetBoostBehavior"
import TargetSlowBehavior from "../../behavior/tower/TargetSlowBehavior"

const TOWER_BEHAVIORS: Record<string, any> = {
  lazer: TargetLaserBehavior,
  plasma: TargetPlasmaBehavior,
  lightning: TargetLightningBehavior,
  flame: TargetFlameBehavior,
  freeze: TargetFreezeBehavior,
  force: TargeForceBehavior,
  poison: TargePoisonBehavior,
  fire: TargetFireBehavior,
  smoke: TargetSmokeBehavior,
  shock: TargetShockBehavior,
  ice: TargetIceBehavior,
  rain: TargetRainBehavior,
  snow: TargetSnowBehavior,
  bullet: TargetBulletBehavior,
  missile: TargetMissileBehavior,
  boost: TargetBoostBehavior,
  slow: TargetSlowBehavior,
}

export default class TDTower extends BehaviorContainer implements ISelectable {

  platform: GameObjects.Sprite
  turret: TDTurret
  targeting = new Targeting()
  showRange: GameObjects.Container
  showLabel: GameObjects.Text
  preview: boolean = false

  constructor(public scene: Scene, public x: number = 0, public y: number = x,
    public model: ITowerModel = TOWER_INDEX.LAZER) {
    super(scene)
    const range = model.stats.range
    this.platform = this.scene.add.sprite(0, 0, `${model.key}-platform`).setInteractive()
      .on(Input.Events.POINTER_OVER, () => {
        this.showRange.visible = true
        if (!this.preview) {
          this.showLabel.visible = true
        }
      }, this)
      .on(Input.Events.POINTER_OUT, () => {
        this.showRange.visible = false
        if (!this.preview) {
          this.showLabel.visible = false
        }
      }, this)
    this.platform.postFX.addShadow(0.2, 1.1, 0.2, 1, 0x000000, 3, 0.5)
    this.add(this.platform)

    this.turret = new TDTurret(scene, 0, 0, model)
    if (model.meta.rotation !== "target") {
      this.behavior.add(new RotateBehavior(this, model.meta.rotation))
    }
    this.add(this.turret)

    this.showRange = scene.add.existing(new TDRange(scene, 0, 0, model.name, model.stats.range))
    this.showRange.visible = false
    this.add(this.showRange)
    this.sendToBack(this.showRange)

    this.showLabel = addLabel(scene, 0, 38, model.name, "center")
    this.showLabel.visible = false
    this.add(this.showLabel)


    this.setSize(range * 2, range * 2) // Sets bounding box

    if (model.meta.rotation === "target") {
      this.behavior.add(new TargetAimBehavior(this))
    }
    this.behavior.add(new TOWER_BEHAVIORS[model.key](this))
    this.behavior.add(new ClearTargetsBehavior(this))
  }

  addSelectHandler(select: (selection?: TDTower) => void) {
    this.platform.on(Input.Events.POINTER_UP, () => {
      if (!this.preview) {
        select(this)
        this.showSelection()
      }
    }, this)
  }

  removeSelectHandler() {
    this.platform.off(Input.Events.POINTER_UP)
  }

  showSelection() {
    this.platform.postFX?.clear()
    this.platform.postFX?.addGlow()
  }

  hideSelection() {
    this.platform.postFX?.clear()
    this.platform.postFX.addShadow(0.2, 1.1, 0.2, 1, 0x000000, 3, 0.5)
  }

  emissionPoint(index: number = 1) {
    if (this.model.meta.rotation === "target") {
      const i = clamp(index, 0, this.turret.weapon.length - 1)
      const weapon = this.turret.weapon[i]
      return toSceneCoordinates(weapon)
    } else {
      return new Point(this.x, this.y)
    }
  }

  emissionPoints() {
    return this.turret.weapon.map((p, i) => this.emissionPoint(i))
  }

}

GameObjects.GameObjectFactory.register("tower",
  function (this: GameObjects.GameObjectFactory, x: number, y: number, model: ITowerModel) {
    const tower = new TDTower(this.scene, x, y, model)
    this.displayList.add(tower)
    this.updateList.add(tower)
    return tower
  }
)
