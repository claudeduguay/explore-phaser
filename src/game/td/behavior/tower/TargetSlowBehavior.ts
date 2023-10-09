import { GameObjects } from "phaser"
import IBehavior from "../core/IBehavior"
import TDTower from "../../entity/tower/TDTower"
import TimedSlowEffect from "../enemy/TimedSlowEffect"

export default class TargetSlowBehavior implements IBehavior<TDTower> {

  g?: GameObjects.Graphics

  update(tower: TDTower, time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (tower.targets.length > 0) {
      this.g = tower.scene.add.graphics({
        fillStyle: { color: 0xff6600, alpha: 0.05 },
        lineStyle: { color: 0xff6600, alpha: 0.2, width: 2 }
      })
      const f = time % 1000 / 1000
      const r1 = tower.model.stats.range * f
      const r2 = tower.model.stats.range - r1
      this.g.fillCircle(tower.x, tower.y, r1)
      this.g.fillCircle(tower.x, tower.y, r2)
      this.g.strokeCircle(tower.x, tower.y, r1)
      this.g.strokeCircle(tower.x, tower.y, r2)

      for (let target of tower.targets) {
        target.effects.push(new TimedSlowEffect(3000))
      }
    }
  }
}
