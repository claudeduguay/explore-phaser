import { GameObjects, Types, Math as PMath } from "phaser"
import IBehavior from "../../core/IBehavior"
import { IEmitterConfig, IEmitterConfigBuilder, circleEmitZone, rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import TargetEffectsMap from "../../core/TargetEffectsMap"
import DamageEffect from "../../enemy/DamageEffect"
import { IPointLike } from "../../../../../util/geom/Point"

export type IDamageEffectBuilder = (enemy: TDEnemy) => IBehavior

export const genericEmitter: IEmitterConfigBuilder =
  (range: number = 80, pos: IPointLike): IEmitterConfig => {
    return {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan: 3000,
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      speed: 0.1,
      blendMode: 'NORMAL',
      emitZone: circleEmitZone(range, pos),
      deathZone: rangeDeathZone(range, pos),
      alpha: { start: 0.2, end: 0 },
      color: [0x009900, 0x00FF00, 0x009900],
      scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
    }
  }

export default class CloudBehavior implements IBehavior {

  cloud?: GameObjects.Particles.ParticleEmitter
  emitterConfig!: Types.GameObjects.Particles.ParticleEmitterConfig
  targetInstanceMap = new TargetEffectsMap()

  constructor(public tower: TDTower, public key: string = "smoke",
    public emitter: IEmitterConfigBuilder = genericEmitter,
    public effect?: IDamageEffectBuilder) {
  }

  // We know that if a tower has no duration it's a range effect
  damageEffectBuilder: IDamageEffectBuilder = (target: TDEnemy) => new DamageEffect(this.tower, target)

  update(time: number, delta: number) {
    if (!this.cloud && this.tower.preview !== PreviewType.Drag) {
      this.emitterConfig = this.emitter(this.tower.model.general.range, this.tower)
      this.cloud = this.tower.scene.add.particles(0, 0, this.key, this.emitterConfig)
      this.cloud.stop()
      // Push effect behind the tower
      if (this.tower instanceof GameObjects.Container) {
        this.tower.add(this.cloud)
        this.tower.sendToBack(this.cloud)
      }
    }
    if (this.tower.targeting.current.length) {
      // Not currently used
      // if (this.emitterConfig.frequency === -1 && time % 2000 < (1000 / 60)) {
      //   console.log("Emit explosion")
      //   this.cloud?.explode(50, 0, 0)
      // }
      this.cloud?.start()
      // const defaultDamageBuilder: IDamageEffectBuilder = (enemy: TDEnemy) => new InRangeDamageEffect(this.tower, enemy)
      // const effectDamageBuilder: IDamageEffectBuilder = this.effect || defaultDamageBuilder
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
