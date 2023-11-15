import { GameObjects, Math as PMath, Display } from "phaser"
import IBehavior from "../../core/IBehavior"
import { rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import DamageEffect from "../../enemy/DamageEffect"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import { toDegrees } from "../../../../../util/MathUtil"

export function burstEmitter(tower: TDTower): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  // const darker = color.value
  const brighter = c.brighten(50).color
  const speed = 120
  const travelPerSecond = speed / 1000
  const lifespan = range / travelPerSecond
  return tower.scene.add.particles(0, 0, sprite.key,
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
      scale: sprite.scale,
      rotate: {
        // Align particle sprite with the velocity direction
        onEmit: (particle: GameObjects.Particles.Particle) => {
          return toDegrees(Math.atan2(particle.velocityY, particle.velocityX) - Math.PI / 2)
        },
        onUpdate: (particle: GameObjects.Particles.Particle) => {
          return toDegrees(Math.atan2(particle.velocityY, particle.velocityX) - Math.PI / 2)
        },
      },
      quantity: 2
    })
}

export type IDamageEffectBuilder = (enemy: TDEnemy) => IBehavior

export default class BurstBehavior implements IBehavior {

  cloud?: GameObjects.Particles.ParticleEmitter
  targetInstanceMap = new TargetEffectsMap()

  constructor(public tower: TDTower, public effect?: IDamageEffectBuilder) {
  }

  // We know that if a tower has no duration it's a range effect
  damageEffectBuilder: IDamageEffectBuilder = (target: TDEnemy) => new DamageEffect(this.tower, target)

  update(time: number, delta: number) {
    if (!this.cloud && this.tower.preview !== PreviewType.Drag) {
      this.cloud = burstEmitter(this.tower)
      this.cloud.stop()
      // Push effect behind the tower
      if (this.tower instanceof GameObjects.Container) {
        this.tower.effect.add(this.cloud)
        this.tower.sendToBack(this.tower.effect)
      }
    }
    if (this.tower.targeting.current.length) {
      this.cloud?.start()
      for (let target of this.tower.targeting.current) {
        const effectBuilder = this.effect ?? this.damageEffectBuilder
        this.targetInstanceMap.apply(target, () => effectBuilder(target))
      }
    } else { // No target
      this.targetInstanceMap.clear()
      this.cloud?.stop()
    }
  }
}
