import { Display, GameObjects, Math as PMath } from "phaser"
import BaseBehavior from "./BaseBehavior"
import { rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import Point from "../../../../../util/geom/Point"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
// import InRangeDamageEffect from "../../enemy/InRangeDamageEffect"

export function sprayEmitter(tower: TDTower): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  const darker = c.darken(100).color
  // const brighter = c.brighten(100).color
  const speed = 100
  const travelPerSecond = speed / 1000
  const lifespan = (range * 1.25) / travelPerSecond
  return tower.scene.add.particles(0, 0, sprite.key, {
    advance: 0,
    lifespan,
    speed,
    colorEase: PMath.Easing.Quadratic.Out.name,
    angle: { min: 5, max: -5 },  // 90 +/- 5
    rotate: { min: 0, max: 360 },
    blendMode: 'ADD',
    deathZone: rangeDeathZone(range * 2, tower), // <<< Doubling range is maybe a scaling problem
    alpha: { start: 1, end: 0.25 },
    color: [darker],
    // color: [0x0000FF, 0xfacc22, 0xf89800, 0xf83600, 0x000000],
    scale: { start: 0.005, end: sprite.scale, ease: 'sine.out' },
    // scale: { start: 0.005, end: 0.15, ease: 'sine.out' },
  })
}

export default class SprayBehavior extends BaseBehavior<GameObjects.Particles.ParticleEmitter> {

  targetInstanceMap = new TargetEffectsMap()

  constructor(tower: TDTower, public key: string = "fire") {
    super(tower, false)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    if (this.emitters.length < i + 1) {
      const emitter = sprayEmitter(this.tower)
      emitter.stop()
      this.emitters.push(emitter)
    }
    if (this.tower.targeting.current.length) {
      const target = this.tower.targeting.current[0]
      this.emitters[i].setPosition(x, y)
      this.emitters[i].rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI
      this.emitters[i].start()
    } else {
      this.targetInstanceMap.clear()
    }
  }
}
