import { GameObjects } from "phaser"
import IBehavior from "../IBehavior"
import { toRadians } from "../../../../util/MathUtil"
import TDTower from "../../entity/tower/TDTower"

export default class TargetBoostBehavior implements IBehavior<TDTower> {

  g?: GameObjects.Graphics

  update(tower: TDTower, time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (tower.targets.length > 0) {
      const slice = 20
      this.g = tower.scene.add.graphics({ fillStyle: { color: 0x00ff00, alpha: 0.1 } })
      for (let a = 0; a < 360; a += slice * 2) {
        const startAngle = toRadians(tower.turret.angle + a)
        const endAngle = toRadians(tower.turret.angle + a + slice)
        this.g.slice(tower.x, tower.y, tower.model.stats.range, startAngle, endAngle).fill()
      }
    }
  }
}
