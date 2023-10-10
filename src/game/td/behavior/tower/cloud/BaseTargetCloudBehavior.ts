import { GameObjects } from "phaser"
import IBehavior from "../../core/IBehavior"
import { applyDamage } from "../BaseTargetBehavior"
import { IEmitterConfigBuilder } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import TDEnemy from "../../../entity/enemy/TDEnemy"

export type IDamageEffectBuilder = (enemy: TDEnemy) => IBehavior<TDEnemy>

export default class BaseTargeCloudBehavior implements IBehavior<TDTower> {

  cloud?: GameObjects.Particles.ParticleEmitter
  effectInstance?: IBehavior<TDEnemy>

  constructor(public tower: TDTower, public key: string, public emitter: IEmitterConfigBuilder, public effect?: IDamageEffectBuilder) {
  }

  update(tower: TDTower, time: number, delta: number) {
    if (!this.cloud) {
      this.cloud = tower.scene.add.particles(0, 0, this.key, this.emitter(tower.model.stats.range, tower))
      this.cloud.stop()
      // Push effect behind the tower
      if (tower instanceof GameObjects.Container) {
        tower.add(this.cloud)
        tower.sendToBack(this.cloud)
      }
    }
    if (tower.targets.length) {
      this.cloud?.start()
      if (this.effect) {
        // If the effect function is defnined, use that instead of applyDamage computation directly
        for (let target of tower.targets) {
          if (!this.effectInstance) {
            // Cache instance so the same one is used on multiple updates
            this.effectInstance = this.effect(target)
          }
          if (!target.effects.includes(this.effectInstance)) {
            target.effects.push(this.effectInstance)
          }
        }
      } else {
        applyDamage(tower, delta)
      }
    } else { // No target
      this.effectInstance = undefined
      this.cloud?.stop()
    }
  }
}
