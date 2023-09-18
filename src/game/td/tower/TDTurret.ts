
import { GameObjects, Scene } from "phaser"

export default class TDTurret extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)
    const tower_turret = this.scene.add.sprite(0, 0, "tower_turret")
    const gun_left = this.scene.add.sprite(-8, -6, "tower_gun")
    const gun_center = this.scene.add.sprite(0, -10, "tower_gun")
    const gun_right = this.scene.add.sprite(8, -6, "tower_gun")
    this.add(tower_turret)
    this.add(gun_left)
    this.add(gun_center)
    this.add(gun_right)
  }
}
