import { GameObjects, Math as PMath, Display } from "phaser"
import IBehavior from "../../core/IBehavior"
import { IEmitterConfig, circleEmitZone, rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import DamageEffect from "../../enemy/DamageEffect"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"

export type IDamageEffectBuilder = (enemy: TDEnemy) => IBehavior

export function cloudEmitter(tower: TDTower): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  const darker = color.value
  const brighter = c.brighten(100).color
  return tower.scene.add.particles(0, 0, sprite.key,
    {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan: 3000,
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      speed: 0.1,
      blendMode: 'NORMAL',
      emitZone: circleEmitZone(range, tower),
      deathZone: rangeDeathZone(range, tower),
      alpha: { start: 0.2, end: 0 },
      color: [darker, brighter, darker],
      scale: { start: sprite.scale * 2, end: sprite.scale * 5, ease: 'sine.out' },
    })
}

export default class CloudBehavior implements IBehavior {

  cloud?: GameObjects.Particles.ParticleEmitter
  targetInstanceMap = new TargetEffectsMap()

  constructor(public tower: TDTower, public effect?: IDamageEffectBuilder) {
  }

  // We know that if a tower has no duration it's a range effect
  damageEffectBuilder: IDamageEffectBuilder = (target: TDEnemy) => new DamageEffect(this.tower, target)

  update(time: number, delta: number) {
    if (!this.cloud && this.tower.preview !== PreviewType.Drag) {
      this.cloud = cloudEmitter(this.tower)
      this.cloud.stop()
      // Push effect behind the tower
      if (this.tower instanceof GameObjects.Container) {
        this.tower.effect.add(this.cloud)
        this.tower.effect.sendToBack(this.cloud)
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
