import { Display, GameObjects, Math as PMath } from "phaser"
import BaseBehavior from "./BaseBehavior"
import { rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import { IPointLike } from "../../../../../util/geom/Point"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
// import InRangeDamageEffect from "../../enemy/InRangeDamageEffect"

export function sprayEmitter(tower: TDTower): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  const brighter = c.brighten(50).color
  const darker = c.darken(50).color
  const speed = 100
  const travelPerSecond = speed / 1000
  const lifespan = (range * 0.66) / travelPerSecond
  return tower.scene.add.particles(0, 0, sprite.key, {
    advance: 0,
    lifespan,
    speed,
    colorEase: PMath.Easing.Quadratic.Out.name,
    angle: { min: 5, max: -5 },  // 90 +/- 5
    rotate: { min: 0, max: 360 },
    blendMode: 'ADD',
    deathZone: rangeDeathZone(range, tower), // <<< Doubling range is maybe a scaling problem
    alpha: [0.25, 1, 0.25],
    color: [0x0000FF, brighter, darker],
    // color: [0x0000FF, 0xfacc22, 0xf89800, 0xf83600, 0x000000],
    scale: { start: 0.005, end: sprite.scale, ease: 'sine.out' },
    // scale: { start: 0.005, end: 0.15, ease: 'sine.out' },
    // quantity: 7
  })
}

export default class SprayBehavior extends BaseBehavior {

  targetInstanceMap = new TargetEffectsMap()

  constructor(tower: TDTower, public key: string = "fire") {
    super(tower, false)
  }

  updateEmitter(i: number, pos: IPointLike, time: number): void {
    if (this.tower.effect.list.length < i + 1) {
      const emitter = sprayEmitter(this.tower)
      emitter.stop()
      this.tower.effect.add(emitter)
    }
    if (this.tower.targeting.current.length) {
      const target = this.tower.targeting.current[0]
      const { x, y } = this.asRelative(pos)
      const emitter = this.tower.effect.list[i] as GameObjects.Particles.ParticleEmitter
      emitter.setPosition(x, y)
      emitter.rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI
      emitter.start()
    } else {
      this.targetInstanceMap.clear()
    }
  }

}
