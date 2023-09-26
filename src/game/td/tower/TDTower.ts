
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

    this.showRange = scene.add.existing(new TDRange(scene, this.x, this.y, model.stats.range))
    this.showRange.visible = false

    this.setSize(range * 2, range * 2) // Sets bounding box

    this.behavior.push(new TargetAimBehavior())
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
      default:
        console.log("Add default (lazer) behavior")
        this.behavior.push(new TargetLaserBehavior())
    }
    // }
    this.behavior.push(new ClearTargetsBehavior())
  }

}
