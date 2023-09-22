
import { GameObjects, Input } from "phaser"
import TDTurret from "./TDTurret"
import BehaviorContainer from "../behavior/BehaviorContainer"
import TargetAimBehavior from "../behavior/TargetAimBehavior"
import ClearTargetsBehavior from "../behavior/TargetsClearBehavior"
import LaserBehavior from "../behavior/LazerBehavior"
import TDRange from "./TDRange"
import ITowerModel from "../model/ITowerModel"
import TDPlayScene from "../scene/TDPlayScene"
import { LAZER_TOWER } from "./TowerData"

export default class TDTower extends BehaviorContainer {

  tower_base: GameObjects.Sprite
  turret: GameObjects.Container
  targets: GameObjects.PathFollower[] = []
  showRange: GameObjects.Container
  showSelection: boolean = false

  constructor(public scene: TDPlayScene, public x: number = 0, public y: number = x, public config: ITowerModel = LAZER_TOWER) {
    super(scene)
    const selectionManager = scene.selectionManager
    const range = config.stats.range
    this.tower_base = this.scene.add.sprite(0, 0, "tower_base").setInteractive()
      .on(Input.Events.POINTER_OVER, () => this.showRange.visible = true, this)
      .on(Input.Events.POINTER_OUT, () => this.showRange.visible = false, this)
      .on(Input.Events.POINTER_UP, () => {
        selectionManager.toggle(this)
      }, this)
      .on(Input.Events.POINTER_DOWN, () => console.log("Mouse down"), this)
    this.add(this.tower_base)

    this.turret = new TDTurret(scene)
    this.add(this.turret)

    this.showRange = scene.add.existing(new TDRange(scene, this.x, this.y, range))
    this.showRange.visible = false

    this.setSize(range * 2, range * 2) // Sets bounding box
    this.behavior.push(new TargetAimBehavior())
    this.behavior.push(new LaserBehavior())
    this.behavior.push(new ClearTargetsBehavior())
  }

}
