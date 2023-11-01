
import { Scene } from "phaser"
import TDWeapon from "./TDWeapon"
import ITowerModel from "../model/ITowerModel"
import Point from "../../../../util/geom/Point"
import BehaviorContainer from "../../behavior/core/BehaviorContainer"

export default class TDTurret extends BehaviorContainer {

  weapon: TDWeapon[] = []

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public model: ITowerModel) {
    super(scene)
    const turret = this.scene.add.sprite(0, 0, `${model.key}-turret`)
    this.add(turret)

    const count = model.general.level
    // Distribute weapons linearly
    if (model.meta.distribution === "linear") {
      let positions = [new Point(-5, -12), new Point(0, -14), new Point(5, -12)]
      if (count === 1) {
        positions = [new Point(0, -5)]
      }
      if (count === 2) {
        positions = [new Point(-4, -3), new Point(4, -3)]
      }

      this.weapon = []
      for (let i = 0; i < model.general.level; i++) {
        const p = positions[i]
        const weapon = new TDWeapon(scene, p.x, p.y, `${model.key}-weapon`)
        this.weapon.push(weapon)
        this.add(weapon)
      }
    }

    // Distribute weapons radially
    if (model.meta.distribution === "radial") {
      let angles = [0, 120, 240]
      if (count === 1) {
        angles = [0]
      }
      if (count === 2) {
        angles = [0, 180]
      }

      this.weapon = []
      for (let i = 0; i < model.general.level; i++) {
        const weapon = new TDWeapon(scene, 0, 0, `${model.key}-weapon`)
        weapon.angle = angles[i]
        this.weapon.push(weapon)
        this.add(weapon)
      }
    }
  }
}