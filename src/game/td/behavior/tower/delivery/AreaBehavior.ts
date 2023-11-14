import IBehavior from "../../core/IBehavior"
import TDTower from "../../../entity/tower/TDTower"
import TimedSlowEffect from "../../enemy/SlowEffect"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import { Display, GameObjects } from "phaser"

export default class AreaBehavior implements IBehavior {

  targetInstanceMap = new TargetEffectsMap()
  twinInstanceMap = new TargetEffectsMap()

  constructor(public tower: TDTower) {
  }

  update(time: number, delta: number) {
    if (this.tower.targeting.current.length > 0) {
      if (this.tower.effect.list.length === 0) {
        const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
        const c = Display.Color.IntegerToColor(color)
        const brighter = c.brighten(50).color
        const emitter = this.tower.scene.add.graphics({
          fillStyle: { color: brighter, alpha: 0.05 },
          lineStyle: { color: brighter, alpha: 0.2, width: 2 }
        })
        this.tower.effect.add(emitter)
      }
      const emitter = this.tower.effect.list[0] as GameObjects.Graphics
      emitter.clear()
      const f = time % 1000 / 1000
      const r1 = this.tower.model.general.range * f
      const r2 = this.tower.model.general.range - r1
      emitter.fillCircle(0, 0, r1)
      emitter.fillCircle(0, 0, r2)
      emitter.strokeCircle(0, 0, r1)
      emitter.strokeCircle(0, 0, r2)

      for (let target of this.tower.targeting.current) {
        this.targetInstanceMap.apply(target, () => new TimedSlowEffect(this.tower, target))
        if (target.twin) { // Handle twin if present
          // Note, event though we checked for existence of target.twin, effectBuilder 
          // complains it may be undefined (disabled ts-check)
          // @ts-ignore
          this.twinInstanceMap.apply(target.twin, () => new TimedSlowEffect(this.tower, target.twin))
        }
      }
    } else {
      this.targetInstanceMap.clear()
      this.twinInstanceMap.clear()
    }
  }
}
