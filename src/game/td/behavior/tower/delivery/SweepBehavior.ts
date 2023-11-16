import { Display, GameObjects } from "phaser"
import { toRadians } from "../../../../../util/MathUtil"
import BaseBehavior from "./BaseBehavior"
import { IPointLike } from "../../../../../util/geom/Point"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"

export default class SweepBehavior extends BaseBehavior {

  g?: GameObjects.Graphics

  updateEmitter(i: number, emissionPoint: IPointLike, time: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (this.tower.targeting.current.length > 0) {
      const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
      const c = Display.Color.IntegerToColor(color)
      const brighter = c.brighten(50).color
      const slice = 20
      this.g = this.tower.scene.add.graphics({ fillStyle: { color: brighter, alpha: 0.1 } })
      this.tower.effect.add(this.g)
      this.tower.sendToBack(this.tower.effect)
      // const f = time % 1000 / 1000
      for (let a = 0; a < 360; a += slice * 2) {
        const startAngle = toRadians(this.tower.turret.angle + a)
        const endAngle = toRadians(this.tower.turret.angle + a + slice)
        this.g?.slice(0, 0, this.tower.model.general.range, startAngle, endAngle).fill()
      }
    }
  }
}
