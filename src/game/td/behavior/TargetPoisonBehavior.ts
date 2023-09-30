import { GameObjects } from "phaser"
import IBehavior from "./IBehavior"
import { cloudEmitter } from "../emitter/ParticleConfig"
import { ITower, applyDamage } from "./BaseTargetBehavior"

export default class TargePoisonBehavior implements IBehavior<ITower> {

  cloud?: GameObjects.Particles.ParticleEmitter

  update(tower: ITower, time: number, delta: number) {
    if (!this.cloud) {
      this.cloud = tower.scene.add.particles(0, 0, 'smoke', cloudEmitter(tower.model.stats.range / 2))
      this.cloud.stop()
      // Push effect behind the tower
      if (tower instanceof GameObjects.Container) {
        tower.add(this.cloud)
        tower.sendToBack(this.cloud)
      }
    }
    if (tower.targets.length) {
      this.cloud?.start()
      applyDamage(tower)
    } else { // No target
      this.cloud?.stop()
    }
  }
}
