
import { Scene } from "phaser"
import TDProjector from "./TDProjector"
import ITowerModel from "../model/ITowerModel"
import Point from "../../../../util/Point"
import BehaviorContainer from "../../behavior/BehaviorContainer"

export default class TDTurret extends BehaviorContainer<TDTurret> {

  projectors: TDProjector[] = []

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public model: ITowerModel) {
    super(scene)
    const turret = this.scene.add.sprite(0, 0, `${model.meta.key}-turret`)
    this.add(turret)

    const count = model.stats.level
    // Distribute linear projectors
    if (model.meta.distribution === "linear") {
      let positions = [new Point(-5, -12), new Point(0, -14), new Point(5, -12)]
      if (count === 1) {
        positions = [new Point(0, -5)]
      }
      if (count === 2) {
        positions = [new Point(-4, -3), new Point(4, -3)]
      }

      this.projectors = []
      for (let i = 0; i < model.stats.level; i++) {
        const p = positions[i]
        const projector = new TDProjector(scene, p.x, p.y, `${model.meta.key}-projector`)
        this.projectors.push(projector)
        this.add(projector)
      }
    }

    // Distribute radial projectors
    if (model.meta.distribution === "radial") {
      let angles = [0, 120, 240]
      if (count === 1) {
        angles = [0]
      }
      if (count === 2) {
        angles = [0, 180]
      }

      this.projectors = []
      for (let i = 0; i < model.stats.level; i++) {
        const projector = new TDProjector(scene, 0, 0, `${model.meta.key}-projector`)
        projector.angle = angles[i]
        this.projectors.push(projector)
        this.add(projector)
      }
    }
  }
}