
import { GameObjects, Input, Scene } from "phaser"
import TDTurret from "./TDTurret"
import BehaviorContainer from "../behavior/BehaviorContainer"
import TargetAimBehavior from "../behavior/TargetAimBehavior"
import ClearTargetsBehavior from "../behavior/TargetsClearBehavior"
import TargetLaserBehavior from "../behavior/TargetLazerBehavior"
import TDRange from "./TDRange"
import ITowerModel from "../model/ITowerModel"
import { LAZER_TOWER } from "../model/ITowerModel"
import SelectionManager from "../scene/SelectionManager"

import RotateBehavior from "../behavior/RotateBehavior"
import TargetLightningBehavior from "../behavior/TargetLightningBehavior"
import TargePoisonBehavior from "../behavior/TargetPoisonBehavior"
import TargetFireBehavior from "../behavior/TargetFireBehavior"
import TargetIceBehavior from "../behavior/TargetIceBehavior"
import TargetBulletBehavior from "../behavior/TargetBulletBehavior"
import TargetBoostBehavior from "../behavior/TargetBoostBehavior"
import TargetSlowBehavior from "../behavior/TargetSlowBehavior"
import Point from "../../../util/Point"
import { clamp, rotation } from "../../../util/MathUtil"

export default class TDTower extends BehaviorContainer {

  tower_base: GameObjects.Sprite
  turret: TDTurret
  targets: GameObjects.PathFollower[] = []
  showRange: GameObjects.Container
  showSelection: boolean = false

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public model: ITowerModel = LAZER_TOWER, selectionManager?: SelectionManager) {
    super(scene)
    const range = model.stats.range
    this.tower_base = this.scene.add.sprite(0, 0, model.meta.platform).setInteractive()
      .on(Input.Events.POINTER_OVER, () => this.showRange.visible = true, this)
      .on(Input.Events.POINTER_OUT, () => this.showRange.visible = false, this)
      .on(Input.Events.POINTER_UP, () => {
        selectionManager?.toggle(this)
      }, this)
    // .on(Input.Events.POINTER_DOWN, () => console.log("Mouse down"), this)
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
      case "fire":
        this.behavior.push(new TargetFireBehavior())
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
