
import { GameObjects, Scene } from "phaser"

export default class TDTurret extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)
    const tower_turret = this.scene.add.sprite(0, 0, "tower_turret")
    const tower_gun = this.scene.add.sprite(0, -8, "tower_gun")
    this.add(tower_turret)
    this.add(tower_gun)
  }
}
