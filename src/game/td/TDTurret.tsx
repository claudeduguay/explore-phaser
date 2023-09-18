
import { Scene, GameObjects } from "phaser"
import BehaviorList from "./behavior/BehaviorList"
import RotateBehavior from "./behavior/RotateBehavior"

export default class TDTurret extends GameObjects.Container {

  behavior = new BehaviorList()

  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)
    const tower_turret = this.scene.add.sprite(0, 0, "tower_turret")
    const tower_gun = this.scene.add.sprite(0, -8, "tower_gun")
    this.add(tower_turret)
    this.add(tower_gun)

    this.behavior.push(new RotateBehavior())
    scene.sys.updateList.add(this)
  }

  preUpdate(time: number, delta: number): void {
    this.behavior.update(this, time, delta)
  }
}
