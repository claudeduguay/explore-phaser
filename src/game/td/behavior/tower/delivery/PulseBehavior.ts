import TDTower from "../../../entity/tower/TDTower"
import TimedSlowEffect from "../../enemy/SlowAffect"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import { Display, GameObjects, Scene } from "phaser"
import BaseBehavior from "./BaseBehavior"
import { IPointLike } from "../../../../../util/geom/Point"

export default class PulseBehavior extends BaseBehavior {

  twinInstanceMap = new TargetEffectsMap() // Needed for slow effect

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
    const emitter = this.scene.add.graphics({
      fillStyle: { color: brighter, alpha: 0.05 },
      lineStyle: { color: brighter, alpha: 0.2, width: 2 }
    })
    this.add(emitter)
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number) {
    if (this.tower.targeting.current.length) {
      const emitter = this.getAt<GameObjects.Graphics>(0)
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
      this.twinInstanceMap.clear()
    }
  }

  clearEmitter(i: number, emissionPoint: IPointLike, time: number): void {
    const emitter = this.getAt<GameObjects.Graphics>(0)
    emitter.clear()
  }
}
