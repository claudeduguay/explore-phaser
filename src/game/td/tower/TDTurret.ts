
import { GameObjects, Scene } from "phaser"
import TDGun from "./TDGun"

export default class TDTurret extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)
    const tower_turret = this.scene.add.sprite(0, 0, "tower_turret")
    const gun_left = new TDGun(scene, -4, -3)
    const gun_center = new TDGun(scene, 0, -5)
    const gun_right = new TDGun(scene, 4, -3)
    this.add(tower_turret)
    this.add(gun_left)
    this.add(gun_center)
    this.add(gun_right)
  }
}
