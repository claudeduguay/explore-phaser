
import { Scene } from "phaser"
import TDGun from "./TDGun"
import ITowerModel from "../model/ITowerModel"
import Point from "../../../util/Point"
import BehaviorContainer from "../behavior/BehaviorContainer"

export default class TDTurret extends BehaviorContainer {

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public model: ITowerModel) {
    super(scene)
    const turret = this.scene.add.sprite(0, 0, model.meta.turret)
    turret.postFX.addShadow(10, 10)
    this.add(turret)

    const count = model.meta.projectors.length
    if (model.meta.distribution === "linear") {
      let positions = [new Point(-5, -12), new Point(0, -14), new Point(5, -12)]
      if (count === 1) {
        positions = [new Point(0, -5)]
      }
      if (count === 2) {
        positions = [new Point(-4, -3), new Point(4, -3)]
      }

      model.meta.projectors.forEach((projector, i) => {
        const p = positions[i]
        this.add(new TDGun(scene, p.x, p.y, projector.sprite))
      })
    }

    if (model.meta.distribution === "radial") {
      let angles = [0, 120, 240]
      if (count === 1) {
        angles = [0]
      }
      if (count === 2) {
        angles = [0, 180]
      }
      model.meta.projectors.forEach((projector, i) => {
        const gun = new TDGun(scene, 0, 0, projector.sprite)
        gun.angle = angles[i]
        this.add(gun)
      })
    }
  }
}