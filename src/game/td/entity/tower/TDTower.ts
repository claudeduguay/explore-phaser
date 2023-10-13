
import { GameObjects, Input, Scene } from "phaser"
import TDTurret from "./TDTurret"
import BehaviorContainer from "../../behavior/core/BehaviorContainer"
import TargetAimBehavior from "../../behavior/tower/TargetAimBehavior"
import ClearTargetsBehavior from "../../behavior/tower/TargetsClearBehavior"
import TargetLaserBehavior from "../../behavior/tower/TargetLazerBehavior"
import TDRange from "./TDRange"
import ITowerModel from "../model/ITowerModel"
import { TOWER_INDEX } from "../model/ITowerModel"
import { ISelectable } from "../../scene/SelectableGroup"
import { clamp } from "../../../../util/MathUtil"

import RotateBehavior from "../../behavior/tower/RotateBehavior"
import TargetLightningBehavior from "../../behavior/tower/TargetLightningBehavior"
import TargePoisonBehavior from "../../behavior/tower/cloud/TargetPoisonBehavior"
import TargetFireBehavior from "../../behavior/tower/cloud/TargetFireBehavior"
import TargetFlameBehavior from "../../behavior/tower/spray/TargetFlameBehavior"
import TargetFreezeBehavior from "../../behavior/tower/spray/TargetFreezeBehavior"
import TargetBulletBehavior from "../../behavior/tower/TargetBulletBehavior"
import TargetBoostBehavior from "../../behavior/tower/TargetBoostBehavior"
import TargetSlowBehavior from "../../behavior/tower/TargetSlowBehavior"
import Point, { toSceneCoordinates } from "../../../../util/Point"
import TargetSmokeBehavior from "../../behavior/tower/cloud/TargetSmokeBehavior"
import TargetShockBehavior from "../../behavior/tower/cloud/TargetShockBehavior"
import TargetIceBehavior from "../../behavior/tower/cloud/TargetIceBehavior"
import TargetPlasmaBehavior from "../../behavior/tower/TargetPlasmaBehavior"
import TargetRainBehavior from "../../behavior/tower/cloud/TargetRainBehavior"
import TargetSnowBehavior from "../../behavior/tower/cloud/TargetSnowBehavior"
import TargeForceBehavior from "../../behavior/tower/spray/TargeForceBehavior"
import TargetMissileBehavior from "../../behavior/tower/TargetMissileBehavior"
import Targeting from "./Targeting"
import { addLabel } from "../../../../util/TextUtil"

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
    switch (model.key) {
      case "plasma":
        this.behavior.add(new TargetPlasmaBehavior(this))
        break
      case "lightning":
        this.behavior.add(new TargetLightningBehavior(this))
        break
      case "flame":
        this.behavior.add(new TargetFlameBehavior(this))
        break
      case "freeze":
        this.behavior.add(new TargetFreezeBehavior(this))
        break
      case "force":
        this.behavior.add(new TargeForceBehavior(this))
        break
      case "poison":
        this.behavior.add(new TargePoisonBehavior(this))
        break
      case "fire":
        this.behavior.add(new TargetFireBehavior(this))
        break
      case "smoke":
        this.behavior.add(new TargetSmokeBehavior(this))
        break
      case "shock":
        this.behavior.add(new TargetShockBehavior(this))
        break
      case "ice":
        this.behavior.add(new TargetIceBehavior(this))
        break
      case "rain":
        this.behavior.add(new TargetRainBehavior(this))
        break
      case "snow":
        this.behavior.add(new TargetSnowBehavior(this))
        break
      case "bullet":
        this.behavior.add(new TargetBulletBehavior(this))
        break
      case "missile":
        this.behavior.add(new TargetMissileBehavior(this))
        break
      case "boost":
        this.behavior.add(new TargetBoostBehavior(this))
        break
      case "slow":
        this.behavior.add(new TargetSlowBehavior(this))
        break
      default:
        this.behavior.add(new TargetLaserBehavior(this))
    }
    this.behavior.add(new ClearTargetsBehavior(this))
  }

  addSelectHandler(select: (selection?: TDTower) => void) {
    this.platform.on(Input.Events.POINTER_UP, () => {
      select(this)
      this.showSelection()
    }, this)
  }

  removeSelectHandler() {
    this.platform.off(Input.Events.POINTER_UP)
  }

  showSelection() {
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
