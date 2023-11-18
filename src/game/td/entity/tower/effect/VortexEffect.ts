import { GameObjects, Math as PMath, Display, Scene, Types } from "phaser"
import { perimiterEmitZone } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../TDTower"
import { DAMAGE_DATA } from "../../model/ITowerData"
import { toDegrees } from "../../../../../util/MathUtil"
import { IPointLike } from "../../../../../util/geom/Point"
import BaseEffect from "./BaseEffect"

const particleVelocity: Types.GameObjects.Particles.EmitterOpOnEmitCallback = (particle?: GameObjects.Particles.Particle, key?: string, value?: number) => {
  if (particle) {
    return toDegrees(Math.atan2(particle.y, particle.x) - Math.PI) - 20
  }
  return value || 0
}


export function vortexEmitter(tower: TDTower): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  const brighter = c.brighten(25).color
  const speed = range * 2
  const travelPerSecond = speed / 1000
  const lifespan = range / travelPerSecond
  const { key, scale } = sprite
  return tower.scene.add.particles(0, 0, key,
    {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan,
      angle: {
        onEmit: particleVelocity
      },
      speed,
      blendMode: 'ADD',
      emitZone: perimiterEmitZone(range, tower),
      alpha: { start: 1, end: 0 },
      color: [brighter, color.value],
      scale,
      rotate: { min: 0, max: 360 },
      quantity: 4
    })
}

export default class VortexEffect extends BaseEffect {

  constructor(scene: Scene, public tower: TDTower) {
    super(scene, tower, {
      singleEmitter: true,
      singleTarget: false
    })
  }

  initEmitter(i: number, emissionPoint: IPointLike, time: number) {
    if (this.tower.preview !== PreviewType.Drag) {
      const cloud = vortexEmitter(this.tower)
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
