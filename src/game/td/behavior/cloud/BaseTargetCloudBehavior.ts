import { GameObjects } from "phaser"
import IBehavior from "../IBehavior"
import { ITower, applyDamage } from "../BaseTargetBehavior"
import { IEmitterConfigBuilder } from "../../emitter/ParticleConfig"

export default class BaseTargeCloudBehavior implements IBehavior<ITower> {

  constructor(public key: string, public emitter: IEmitterConfigBuilder) {
  }

  cloud?: GameObjects.Particles.ParticleEmitter

  update(tower: ITower, time: number, delta: number) {
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
      applyDamage(tower, delta)
    } else { // No target
      this.cloud?.stop()
    }
  }
}
