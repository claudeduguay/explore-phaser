import { GameObjects } from "phaser"
import IBehavior from "../core/IBehavior"
import { toRadians } from "../../../../util/MathUtil"
import TDTower from "../../entity/tower/TDTower"

export default class TargetBoostBehavior implements IBehavior {

  g?: GameObjects.Graphics

  constructor(public tower: TDTower) {
  }

  update(time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (this.tower.targeting.current.length > 0) {
      const slice = 20
      this.g = this.tower.scene.add.graphics({ fillStyle: { color: 0x00ff00, alpha: 0.1 } })
      for (let a = 0; a < 360; a += slice * 2) {
        const startAngle = toRadians(this.tower.turret.angle + a)
        const endAngle = toRadians(this.tower.turret.angle + a + slice)
        this.g.slice(this.tower.x, this.tower.y, this.tower.model.general.range, startAngle, endAngle).fill()
      }
    }
  }
}
