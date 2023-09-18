
import { Scene, GameObjects, Input } from "phaser"
import TDTurret from "./TDTurret"
import BaseEnemy from "../enemy/BaseEnemy"
import BehaviorContainer from "../behavior/BehaviorContainer"
import TargetBehavior from "../behavior/TargetBehavior"

export default class TDTower extends BehaviorContainer {

  tower_base: GameObjects.Sprite
  turret: GameObjects.Container
  target?: BaseEnemy

  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)
    this.tower_base = this.scene.add.sprite(0, 0, "tower_base").setInteractive()
      .on(Input.Events.POINTER_OVER, () => console.log("Mouse over"), this)
      .on(Input.Events.POINTER_OUT, () => console.log("Mouse out"), this)
      .on(Input.Events.POINTER_DOWN, () => console.log("Mouse down"), this)
      .on(Input.Events.POINTER_UP, () => console.log("Mouse up"), this)
    this.add(this.tower_base)

    this.turret = new TDTurret(scene)
    this.add(this.turret)

    this.behavior.push(new TargetBehavior())
  }
}
