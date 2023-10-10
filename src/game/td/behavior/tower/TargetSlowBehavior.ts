import { GameObjects } from "phaser"
import IBehavior from "../core/IBehavior"
import TDTower from "../../entity/tower/TDTower"
import TimedSlowEffect from "../enemy/TimedSlowEffect"

export default class TargetSlowBehavior implements IBehavior {

  g?: GameObjects.Graphics

  constructor(public tower: TDTower) {
  }

  update(time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (this.tower.targeting.current.length > 0) {
      this.g = this.tower.scene.add.graphics({
        fillStyle: { color: 0xff6600, alpha: 0.05 },
        lineStyle: { color: 0xff6600, alpha: 0.2, width: 2 }
      })
      const f = time % 1000 / 1000
      const r1 = this.tower.model.stats.range * f
      const r2 = this.tower.model.stats.range - r1
      this.g.fillCircle(this.tower.x, this.tower.y, r1)
      this.g.fillCircle(this.tower.x, this.tower.y, r2)
      this.g.strokeCircle(this.tower.x, this.tower.y, r1)
      this.g.strokeCircle(this.tower.x, this.tower.y, r2)

      for (let target of this.tower.targeting.current) {
        const SLOW_EFFECT = new TimedSlowEffect(target, 2000)
        if (!target.effects.includes(SLOW_EFFECT)) {
          target.effects.push(SLOW_EFFECT)
          if (target.twin) {
            // Handle preview twin speed
            target.twin.effects.push(SLOW_EFFECT)
          }
        }
      }
    }
  }
}
