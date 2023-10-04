import { GameObjects, Types } from "phaser"
import IBehavior from "../IBehavior"
import { ITower, applyDamage } from "../BaseTargetBehavior"
import Point from "../../../../util/Point"

export type IEmitterConfigurator = (range: number) => Types.GameObjects.Particles.ParticleEmitterConfig

export default class BaseTargeCloudBehavior implements IBehavior<ITower> {

  constructor(
    public key: string,
    public emitter: IEmitterConfigurator,
    public offset: Point = new Point()) {
  }

  cloud?: GameObjects.Particles.ParticleEmitter

  update(tower: ITower, time: number, delta: number) {
    if (!this.cloud) {
      this.cloud = tower.scene.add.particles(this.offset.x, this.offset.y, this.key, this.emitter(tower.model.stats.range))
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
