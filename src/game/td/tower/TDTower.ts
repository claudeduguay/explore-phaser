
import { GameObjects, Input, Scene } from "phaser"
import TDTurret from "./TDTurret"
import BehaviorContainer from "../behavior/BehaviorContainer"
import TargetAimBehavior from "../behavior/TargetAimBehavior"
import ClearTargetsBehavior from "../behavior/TargetsClearBehavior"
import TargetLaserBehavior from "../behavior/TargetLazerBehavior"
import TDRange from "./TDRange"
import ITowerModel from "../model/ITowerModel"
import { LAZER_TOWER } from "../model/ITowerModel"
import { ISelectable } from "../scene/SelectableGroup"

import RotateBehavior from "../behavior/RotateBehavior"
import TargetLightningBehavior from "../behavior/TargetLightningBehavior"
import TargePoisonBehavior from "../behavior/cloud/TargetPoisonBehavior"
import TargetFireBehavior from "../behavior/cloud/TargetFireBehavior"
import TargetFlameBehavior from "../behavior/spray/TargetFlameBehavior"
import TargetIceBehavior from "../behavior/spray/TargetIceBehavior"
import TargetBulletBehavior from "../behavior/TargetBulletBehavior"
import TargetBoostBehavior from "../behavior/TargetBoostBehavior"
import TargetSlowBehavior from "../behavior/TargetSlowBehavior"
import Point from "../../../util/Point"
import { clamp, rotation } from "../../../util/MathUtil"
import TargetSmokeBehavior from "../behavior/cloud/TargetSmokeBehavior"
import TargetShockBehavior from "../behavior/cloud/TargetShockBehavior"
import TargetFreezeBehavior from "../behavior/cloud/TargetFreezeBehavior"
import TargetPlasmaBehavior from "../behavior/TargetPlasmaBehavior"
import TargetRainBehavior from "../behavior/cloud/TargetRainBehavior"
import TargetSnowBehavior from "../behavior/cloud/TargetSnowBehavior"

export default class TDTower extends BehaviorContainer implements ISelectable {

  tower_base: GameObjects.Sprite
  turret: TDTurret
  targets: GameObjects.PathFollower[] = []
  showRange: GameObjects.Container
  preview: boolean = false

  constructor(public scene: Scene, public x: number = 0, public y: number = x,
    public model: ITowerModel = LAZER_TOWER) {
    super(scene)
    const range = model.stats.range
    this.tower_base = this.scene.add.sprite(0, 0, `${model.meta.key}-platform`).setInteractive()
      .on(Input.Events.POINTER_OVER, () => this.showRange.visible = true, this)
      .on(Input.Events.POINTER_OUT, () => this.showRange.visible = false, this)
    this.add(this.tower_base)

    this.turret = new TDTurret(scene, 0, 0, model)
    if (model.meta.rotation !== "target") {
      this.turret.behavior.push(new RotateBehavior(model.meta.rotation))
    }
    this.add(this.turret)

    this.showRange = scene.add.existing(new TDRange(scene, 0, 0, model.stats.range))
    this.showRange.visible = false
    this.add(this.showRange)

    this.setSize(range * 2, range * 2) // Sets bounding box

    if (model.meta.rotation === "target") {
      this.behavior.push(new TargetAimBehavior())
    }
    switch (model.meta.key) {
      case "plasma":
        this.behavior.push(new TargetPlasmaBehavior())
        break
      case "flame":
        this.behavior.push(new TargetFlameBehavior())
        break
      case "ice":
        this.behavior.push(new TargetIceBehavior())
        break
      case "lightning":
        this.behavior.push(new TargetLightningBehavior())
        break
      case "poison":
        this.behavior.push(new TargePoisonBehavior())
        break
      case "fire":
        this.behavior.push(new TargetFireBehavior())
        break
      case "smoke":
        this.behavior.push(new TargetSmokeBehavior())
        break
      case "shock":
        this.behavior.push(new TargetShockBehavior())
        break
      case "freeze":
        this.behavior.push(new TargetFreezeBehavior())
        break
      case "rain":
        this.behavior.push(new TargetRainBehavior())
        break
      case "snow":
        this.behavior.push(new TargetSnowBehavior())
        break
      case "bullet":
        this.behavior.push(new TargetBulletBehavior())
        break
      case "boost":
        this.behavior.push(new TargetBoostBehavior())
        break
      case "slow":
        this.behavior.push(new TargetSlowBehavior())
        break
      default:
        this.behavior.push(new TargetLaserBehavior())
    }
    this.behavior.push(new ClearTargetsBehavior())
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
    return this.turret.projectors.map((p, i) => this.emissionPoint(i))
  }

  // May be useful to studdy: https://www.html5gamedevs.com/topic/24535-how-to-calculate-absolute-world-xy-without-using-world-xy-property/
  emissionPoint(index: number = 1) {
    if (this.model.meta.rotation === "target") {
      const i = clamp(index, 0, this.turret.projectors.length - 1)
      const projector = this.turret.projectors[i]
      const size = projector.getSize()
      const p = new Point(projector.x, projector.y - size.y / 2)
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

