import { GameObjects, Types } from "phaser"
import IBehavior from "../../core/IBehavior"
import { IEmitterConfigBuilder } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import InRangeDamageEffect from "../../enemy/InRangeDamageEffect"
import TargetEffectsMap from "../../core/TargetEffectsMap"

export type IDamageEffectBuilder = (enemy: TDEnemy) => IBehavior

export default class BaseTargeCloudBehavior implements IBehavior {

  cloud?: GameObjects.Particles.ParticleEmitter
  emitterConfig!: Types.GameObjects.Particles.ParticleEmitterConfig
  targetInstanceMap = new TargetEffectsMap()

  constructor(public tower: TDTower, public key: string,
    public emitter: IEmitterConfigBuilder,
    public effect?: IDamageEffectBuilder) {
  }

  update(time: number, delta: number) {
    if (!this.cloud && this.tower.preview !== PreviewType.Drag) {
      this.emitterConfig = this.emitter(this.tower.model.stats.range, this.tower)
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
      const defaultDamageBuilder: IDamageEffectBuilder = (enemy: TDEnemy) => new InRangeDamageEffect(this.tower, enemy, "")
      const effectDamageBuilder: IDamageEffectBuilder = this.effect || defaultDamageBuilder
      for (let target of this.tower.targeting.current) {
        this.targetInstanceMap.apply(target, () => effectDamageBuilder(target))
      }
    } else { // No target
      this.targetInstanceMap.clear()
      this.cloud?.stop()
    }
  }
}
