
import { GameObjects, Input, Scene } from "phaser"
import TDTurret from "./TDTurret"
import BehaviorContainer from "../../behavior/core/BehaviorContainer"
import TargetAimBehavior from "../../behavior/tower/TargetAimBehavior"
import ClearTargetsBehavior from "../../behavior/tower/TargetsClearBehavior"
import TargetLaserBehavior from "../../behavior/tower/TargetLazerBehavior"
import TDRange from "./TDRange"
import ITowerModel from "../model/ITowerModel"
import { TOWER_MODELS } from "../model/ITowerModel"
import { ISelectable } from "../../scene/SelectableGroup"

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
import { clamp } from "../../../../util/MathUtil"
import TargetSmokeBehavior from "../../behavior/tower/cloud/TargetSmokeBehavior"
import TargetShockBehavior from "../../behavior/tower/cloud/TargetShockBehavior"
import TargetIceBehavior from "../../behavior/tower/cloud/TargetIceBehavior"
import TargetPlasmaBehavior from "../../behavior/tower/TargetPlasmaBehavior"
import TargetRainBehavior from "../../behavior/tower/cloud/TargetRainBehavior"
import TargetSnowBehavior from "../../behavior/tower/cloud/TargetSnowBehavior"
import TargetImpactBehavior from "../../behavior/tower/spray/TargetImpactBehavior"
import TargetMissileBehavior from "../../behavior/tower/TargetMissileBehavior"
import Targeting from "./Targeting"

export default class TDTower extends BehaviorContainer implements ISelectable {

  platform: GameObjects.Sprite
  turret: TDTurret
  targeting = new Targeting()
  showRange: GameObjects.Container
  preview: boolean = false

  constructor(public scene: Scene, public x: number = 0, public y: number = x,
    public model: ITowerModel = TOWER_MODELS.LAZER) {
    super(scene)
    const range = model.stats.range
    this.platform = this.scene.add.sprite(0, 0, `${model.key}-platform`).setInteractive()
      .on(Input.Events.POINTER_OVER, () => this.showRange.visible = true, this)
      .on(Input.Events.POINTER_OUT, () => this.showRange.visible = false, this)
    this.add(this.platform)

    this.turret = new TDTurret(scene, 0, 0, model)
    if (model.meta.rotation !== "target") {
      this.behavior.add(new RotateBehavior(this, model.meta.rotation))
    }
    this.add(this.turret)

    this.showRange = scene.add.existing(new TDRange(scene, 0, 0, model.name, model.stats.range))
    this.showRange.visible = false
    this.add(this.showRange)

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
      case "impact":
        this.behavior.add(new TargetImpactBehavior(this))
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
