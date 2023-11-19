import { GameObjects, Math as PMath, Display, Scene } from "phaser"
import { circleEmitZone, rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import { IPointLike } from "../../../../../util/geom/Point"
import BaseEffect from "./BaseEffect"

export function cloudEmitter(tower: TDTower): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  const darker = c.darken(50).color
  const brighter = c.brighten(50).color
  return tower.scene.add.particles(0, 0, sprite.key,
    {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan: 3000,
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      speed: 0.1,
      blendMode: 'ADD',
      emitZone: circleEmitZone(range, tower),
      deathZone: rangeDeathZone(range, tower),
      alpha: { start: 0.2, end: 0 },
      color: [brighter, color.value, darker],
      scale: { start: sprite.scale * 2, end: sprite.scale * 5, ease: 'sine.out' },
    })
}

export default class CloudEffect extends BaseEffect {

  constructor(tower: TDTower) {
    super(tower, {
      singleEmitter: true,
      singleTarget: false
    })
  }

  initEmitter(i: number, emissionPoint: IPointLike, time: number) {
    const cloud = cloudEmitter(this.tower)
    cloud.stop()
    this.add(cloud)
    this.tower.sendToBack(this)
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number) {
    const cloud = this.getAt<GameObjects.Particles.ParticleEmitter>(0)
    if (this.tower.targeting.current.length) {
      cloud.start()
    } else { // No target
      cloud.stop()
    }
  }
}
