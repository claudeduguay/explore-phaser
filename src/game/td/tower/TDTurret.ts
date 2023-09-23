
import { GameObjects, Scene } from "phaser"
import TDGun from "./TDGun"
import ITowerModel from "../model/ITowerModel"
import Point from "../../../util/Point"

export default class TDTurret extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public model: ITowerModel) {
    super(scene)
    const turret = this.scene.add.sprite(0, 0, model.meta.turret)
    turret.postFX.addGlow(0x999999, 3, 0)
    this.add(turret)

    let positions = [new Point(-5, -3), new Point(0, -5), new Point(5, -3)]
    const count = model.meta.projectors.length
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
}
