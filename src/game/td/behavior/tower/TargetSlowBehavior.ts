import { GameObjects } from "phaser"
import IBehavior from "../core/IBehavior"
import TDTower from "../../entity/tower/TDTower"
import TimedSlowEffect from "../enemy/TimedSlowEffect"
import TargetEffectsMap from "../core/TargetEffectsMap"

export default class TargetSlowBehavior implements IBehavior {

  g?: GameObjects.Graphics
  targetInstanceMap = new TargetEffectsMap()
  twinInstanceMap = new TargetEffectsMap()

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

      const duration = this.tower.model.damage.slow.duration || 0
      for (let target of this.tower.targeting.current) {
        this.targetInstanceMap.apply(target, () => new TimedSlowEffect(target, duration))
        if (target.twin) { // Handle twin if present
          // Note, event though we checked for existence of target.twin, effectBuilder 
          // complains it may be undefined (disabled ts-check)
          // @ts-ignore
          this.twinInstanceMap.apply(target.twin, () => new TimedSlowEffect(target.twin, duration))
        }
      }
    } else {
      this.targetInstanceMap.clear()
      this.twinInstanceMap.clear()
    }
  }
}
