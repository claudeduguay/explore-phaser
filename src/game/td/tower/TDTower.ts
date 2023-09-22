
import { Scene, GameObjects, Input } from "phaser"
import TDTurret from "./TDTurret"
import BaseEnemy from "../enemy/BaseEnemy"
import BehaviorContainer from "../behavior/BehaviorContainer"
import TargetAimBehavior from "../behavior/TargetAimBehavior"
import ClearTargetsBehavior from "../behavior/TargetsClearBehavior"
import LaserBehavior from "../behavior/LazerBehavior"
import TDRange from "./TDRange"

export default class TDTower extends BehaviorContainer {

  tower_base: GameObjects.Sprite
  turret: GameObjects.Container
  targets: BaseEnemy[] = []
  showRange: GameObjects.Container
  showSelection: boolean = false

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public towerGroup: GameObjects.Group, name: string = "Tower", public range: number = 150) {
    super(scene)
    this.tower_base = this.scene.add.sprite(0, 0, "tower_base").setInteractive()
      .on(Input.Events.POINTER_OVER, () => this.showRange.visible = true, this)
      .on(Input.Events.POINTER_OUT, () => this.showRange.visible = false, this)
      .on(Input.Events.POINTER_UP, () => {
        this.showSelection = !this.showSelection
        if (this.showSelection) {
          // Clear group FX
          towerGroup.children.entries.forEach((t) => {
            if (t instanceof TDTower) {
              t.showSelection = false
              t.postFX?.clear()
            }
          })
          // Add glow to this tower
          this.postFX?.addGlow(0x00FF00)
        } else {
          // Else (showSelection = false) clear FX
          this.postFX?.clear()
        }
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

  capture(key: string = "capture-tower") {
    const capture = this.scene.textures.addDynamicTexture(key, 64, 64)
    const tower = new TDTower(this.scene, 32, 32, this.towerGroup)
    tower.angle = 90
    capture?.draw(tower)
    return capture
  }

}
