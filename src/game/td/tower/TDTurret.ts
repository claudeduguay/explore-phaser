
import { GameObjects, Scene } from "phaser"
import TDGun from "./TDGun"
import ITowerModel from "../model/ITowerModel"

export default class TDTurret extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public model: ITowerModel) {
    super(scene)
    const tower_turret = this.scene.add.sprite(0, 0, model.meta.turret)
    const gun_left = new TDGun(scene, -4, -3, model.meta.emitters[0])
    const gun_center = new TDGun(scene, 0, -5, model.meta.emitters[1])
    const gun_right = new TDGun(scene, 4, -3, model.meta.emitters[2])
    this.add(tower_turret)
    this.add(gun_left)
    this.add(gun_center)
    this.add(gun_right)
  }
}
