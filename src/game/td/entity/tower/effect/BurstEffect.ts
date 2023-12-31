import { GameObjects, Math as PMath, Display, Types } from "phaser"
import { rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import { toDegrees } from "../../../../../util/MathUtil"
import { IPointLike } from "../../../../../util/geom/Point"
import BaseEffect from "./BaseEffect"

const particleRotation: Types.GameObjects.Particles.EmitterOpOnEmitCallback = (particle?: GameObjects.Particles.Particle, key?: string, value?: number) => {
  if (particle) {
    return toDegrees(Math.atan2(particle.velocityY, particle.velocityX) - Math.PI / 2)
  }
  return value || 0
}

export function burstEmitter(tower: TDTower): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  // const darker = color.value
  const brighter = c.brighten(50).color
  const speed = 120
  const travelPerSecond = speed / 1000
  const lifespan = range / travelPerSecond
  return tower.scene.add.particles(0, 0, "rain",
    {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan,
      angle: { min: 0, max: 360 },
      speed,
      blendMode: 'ADD',
      deathZone: rangeDeathZone(range, tower),
      alpha: { start: 1, end: 0 },
      color: [color.value, brighter],
      scale: 0.15,
      rotate: {
        onEmit: particleRotation,
        onUpdate: particleRotation,
      },
      quantity: 2
    })
}

export default class BurstEffect extends BaseEffect {

  constructor(public tower: TDTower) {
    super(tower, {
      singleEmitter: true,
      singleTarget: false
    })
  }

  initEmitter(i: number, emissionPoint: IPointLike, time: number) {
    if (this.tower.preview !== PreviewType.Drag) {
      const cloud = burstEmitter(this.tower)
      cloud.stop()
      this.add(cloud)
      this.tower.sendToBack(this)
    }
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
