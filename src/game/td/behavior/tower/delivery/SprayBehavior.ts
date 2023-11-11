import { GameObjects, Math as PMath } from "phaser"
import BaseBehavior from "./BaseBehavior"
import { IEmitterConfig, IEmitterConfigBuilder, rangeDeathZone } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import TargetEffectsMap from "../../core/TargetEffectsMap"
// import InRangeDamageEffect from "../../enemy/InRangeDamageEffect"

export const generalEmitter: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    const speed = 100
    const travelPerSecond = speed / 1000
    const lifespan = (range * 1.25) / travelPerSecond
    return {
      advance: 0,
      lifespan,
      speed,
      colorEase: PMath.Easing.Quadratic.Out.name,
      angle: { min: 5, max: -5 },  // 90 +/- 5
      rotate: { min: 0, max: 360 },
      blendMode: 'ADD',
      deathZone: rangeDeathZone(range, pos),
      alpha: { start: 0.75, end: 0.25 },
      color: [0x0000FF, 0xfacc22, 0xf89800, 0xf83600, 0x000000],
      scale: { start: 0.005, end: 0.15, ease: 'sine.out' },
    }
  }

export default class SprayBehavior extends BaseBehavior<GameObjects.Particles.ParticleEmitter> {

  targetInstanceMap = new TargetEffectsMap()

  constructor(tower: TDTower, public key: string = "fire", public emitter: IEmitterConfigBuilder = generalEmitter) {
    super(tower, false)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    if (this.emitters.length < i + 1) {
      const emitterConfig = this.emitter(this.tower.model.general.range, this.tower)
      const emitter = this.tower.scene.add.particles(x, y, this.key, emitterConfig)
      emitter.stop()
      this.emitters.push(emitter)
    }
    if (this.tower.targeting.current.length) {
      const target = this.tower.targeting.current[0]
      this.emitters[i].setPosition(x, y)
      this.emitters[i].rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI
      this.emitters[i].start()
    } else {
      this.targetInstanceMap.clear()
    }
  }
}
