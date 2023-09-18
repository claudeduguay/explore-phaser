
import { Scene, GameObjects, Input, Types, Math as PMath } from "phaser"
import TDTurret from "./TDTurret"
import BaseEnemy from "../enemy/BaseEnemy"
import BehaviorContainer from "../behavior/BehaviorContainer"
import TargetAimBehavior from "../behavior/TargetAimBehavior"
import ClearTargetsBehavior from "../behavior/TargetsClearBehavior"
import LaserBehavior from "../behavior/LazerBehavior"

export default class TDTower extends BehaviorContainer {

  name: string = "tower"
  tower_base: GameObjects.Sprite
  turret: GameObjects.Container
  targets: BaseEnemy[] = []
  showRange: GameObjects.Graphics
  showSelection: GameObjects.Graphics

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public range: number = 150) {
    super(scene)
    this.tower_base = this.scene.add.sprite(0, 0, "tower_base").setInteractive()
      .on(Input.Events.POINTER_OVER, () => this.showRange.visible = true, this)
      .on(Input.Events.POINTER_OUT, () => this.showRange.visible = false, this)
      .on(Input.Events.POINTER_DOWN, () => this.showSelection.visible = !this.showSelection.visible, this)
      .on(Input.Events.POINTER_UP, () => console.log("Mouse up"), this)
    this.add(this.tower_base)

    this.turret = new TDTurret(scene)
    this.add(this.turret)

    this.showRange = scene.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0.1 } })
      .fillCircle(this.x, this.y, range)
    scene.add.existing(this.showRange)
    this.showRange.visible = false

    this.showSelection = scene.add.graphics({ lineStyle: { color: 0xffffff, alpha: 1.0, width: 3 } })
      .strokeRoundedRect(this.x - 32, this.y - 32, 64, 64, 16)
    scene.add.existing(this.showSelection)
    this.showSelection.visible = false

    this.setSize(range * 2, range * 2) // Sets bounding box
    this.behavior.push(new TargetAimBehavior())
    this.behavior.push(new LaserBehavior())
    this.behavior.push(new ClearTargetsBehavior())
  }

  onOverlap(
    tower: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    if (tower === this) {
      const distance = PMath.Distance.BetweenPoints(enemy as BaseEnemy, this)
      if (distance <= this.range) {
        // NOTE: order appears to depend on enemies group order
        this.targets.push(enemy as BaseEnemy)
      }
    }
  }

}
