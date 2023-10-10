
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
import Point from "../../../../util/Point"
import { clamp, rotation } from "../../../../util/MathUtil"
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

  tower_base: GameObjects.Sprite
  turret: TDTurret
  targeting = new Targeting()
  showRange: GameObjects.Container
  preview: boolean = false

  constructor(public scene: Scene, public x: number = 0, public y: number = x,
    public model: ITowerModel = TOWER_MODELS.LAZER) {
    super(scene)
    const range = model.stats.range
    this.tower_base = this.scene.add.sprite(0, 0, `${model.meta.key}-platform`).setInteractive()
      .on(Input.Events.POINTER_OVER, () => this.showRange.visible = true, this)
      .on(Input.Events.POINTER_OUT, () => this.showRange.visible = false, this)
    this.add(this.tower_base)

    this.turret = new TDTurret(scene, 0, 0, model)
    if (model.meta.rotation !== "target") {
      this.behavior.push(new RotateBehavior(this, model.meta.rotation))
    }
    this.add(this.turret)

    this.showRange = scene.add.existing(new TDRange(scene, 0, 0, model.stats.range))
    this.showRange.visible = false
    this.add(this.showRange)

    this.setSize(range * 2, range * 2) // Sets bounding box

    if (model.meta.rotation === "target") {
      this.behavior.push(new TargetAimBehavior(this))
    }
    switch (model.meta.key) {
      case "plasma":
        this.behavior.push(new TargetPlasmaBehavior(this))
        break
      case "lightning":
        this.behavior.push(new TargetLightningBehavior(this))
        break
      case "flame":
        this.behavior.push(new TargetFlameBehavior(this))
        break
      case "freeze":
        this.behavior.push(new TargetFreezeBehavior(this))
        break
      case "impact":
        this.behavior.push(new TargetImpactBehavior(this))
        break
      case "poison":
        this.behavior.push(new TargePoisonBehavior(this))
        break
      case "fire":
        this.behavior.push(new TargetFireBehavior(this))
        break
      case "smoke":
        this.behavior.push(new TargetSmokeBehavior(this))
        break
      case "shock":
        this.behavior.push(new TargetShockBehavior(this))
        break
      case "ice":
        this.behavior.push(new TargetIceBehavior(this))
        break
      case "rain":
        this.behavior.push(new TargetRainBehavior(this))
        break
      case "snow":
        this.behavior.push(new TargetSnowBehavior(this))
        break
      case "bullet":
        this.behavior.push(new TargetBulletBehavior(this))
        break
      case "missile":
        this.behavior.push(new TargetMissileBehavior(this))
        break
      case "boost":
        this.behavior.push(new TargetBoostBehavior(this))
        break
      case "slow":
        this.behavior.push(new TargetSlowBehavior(this))
        break
      default:
        this.behavior.push(new TargetLaserBehavior(this))
    }
    this.behavior.push(new ClearTargetsBehavior(this))
  }

  addSelectHandler(select: (selection?: TDTower) => void) {
    this.tower_base.on(Input.Events.POINTER_UP, () => {
      select(this)
      this.showSelection()
    }, this)
  }

  removeSelectHandler() {
    this.tower_base.off(Input.Events.POINTER_UP)
  }

  showSelection() {
    this.tower_base.postFX?.addGlow()
  }

  hideSelection() {
    this.tower_base.postFX?.clear()
  }


  // This could start to get expensive on each frame
  emissionPoints() {
    return this.turret.weapon.map((p, i) => this.emissionPoint(i))
  }

  // May be useful to studdy: https://www.html5gamedevs.com/topic/24535-how-to-calculate-absolute-world-xy-without-using-world-xy-property/
  emissionPoint(index: number = 1) {
    if (this.model.meta.rotation === "target") {
      const i = clamp(index, 0, this.turret.weapon.length - 1)
      const weapon = this.turret.weapon[i]
      const size = weapon.getSize()
      const p = new Point(weapon.x, weapon.y - size.y / 2)
      const r = p.length()
      const a = this.turret.rotation
      const adjust = Math.atan2(p.y, p.x) + Math.PI / 2
      return rotation(this.x, this.y, r, r, a + adjust * 2)
    } else {
      return new Point(this.x, this.y)
    }
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

