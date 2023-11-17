import { Display, GameObjects, Scene } from "phaser"
import { toRadians } from "../../../../../util/MathUtil"
import BaseBehavior from "./BaseBehavior"
import { IPointLike } from "../../../../../util/geom/Point"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import TDTower from "../../../entity/tower/TDTower"

export default class SweepBehavior extends BaseBehavior {

  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, {
      singleEmitter: true,
      singleTarget: false
    })
  }

  initEmitter(i: number, emissionPoint: IPointLike, time: number) {
    const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
    const c = Display.Color.IntegerToColor(color)
    const brighter = c.brighten(50).color
    const g = this.scene.add.graphics({ fillStyle: { color: brighter, alpha: 0.1 } })
    this.add(g)
    this.tower.sendToBack(this)
    const slice = 20
    // const f = time % 1000 / 1000
    for (let a = 0; a < 360; a += slice * 2) {
      const startAngle = toRadians(this.tower.turret.angle + a)
      const endAngle = toRadians(this.tower.turret.angle + a + slice)
      g.slice(0, 0, this.tower.model.general.range, startAngle, endAngle).fill()
    }
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number) {
    const g = this.getAt<GameObjects.Graphics>(0)
    g.angle = this.tower.turret.angle
  }

  clearEmitter(i: number, emissionPoint: IPointLike, time: number): void {
    const emitter = this.getAt<GameObjects.Graphics>(0)
    emitter.clear()
  }
}
