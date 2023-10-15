import { GameObjects } from "phaser"
import IBehavior from "../core/IBehavior"
import TDTower from "../../entity/tower/TDTower"
import TimedSlowEffect from "../enemy/TimedSlowEffect"

export default class TargetSlowBehavior implements IBehavior {

  g?: GameObjects.Graphics
  targetEffects: TimedSlowEffect[] = []
  twinEffects: TimedSlowEffect[] = []

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

      for (let i = 0; i < this.tower.targeting.current.length; i++) {
        const target = this.tower.targeting.current[i]
        if (!this.targetEffects[i]) {
          this.targetEffects[i] = new TimedSlowEffect(target, 2000)
        }
        if (!target.effects.includes(this.targetEffects[i])) {
          target.effects.add(this.targetEffects[i])

          if (target.twin) { // Handle twin if present
            if (!this.twinEffects[i]) {
              this.twinEffects[i] = new TimedSlowEffect(target.twin, 2000)
            }
            if (!target.twin.effects.includes(this.twinEffects[i])) {
              target.twin.effects.add(this.twinEffects[i])
            }
          }
        }
      }
    }
  }
}
