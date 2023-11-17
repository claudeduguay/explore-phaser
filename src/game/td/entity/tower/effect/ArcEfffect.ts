import { GameObjects, Math as PMath, Display, Scene } from "phaser"
import { rangeDeathZone, topEmitZone, bottomEmitZone, eastEmitZone, westEmitZone } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import { IPointLike } from "../../../../../util/geom/Point"
import BaseEffect from "./BaseEffect"

export function arcEmitter(tower: TDTower, angle: number): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  const brighter = c.brighten(50).color
  let emitZone = topEmitZone(range, tower)
  switch (angle) {
    case 0:
      emitZone = westEmitZone(range, tower)
      break
    case 90:
      emitZone = topEmitZone(range, tower)
      break
    case 180:
      emitZone = eastEmitZone(range, tower)
      break
    case 270:
    case -90:
      emitZone = bottomEmitZone(range, tower)
      break
  }
  return tower.scene.add.particles(0, 0, sprite.key,
    {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan: 3000,
      angle,
      rotate: { start: 0, end: 360 },
      speed: 100,
      emitZone,
      deathZone: rangeDeathZone(range, tower),
      alpha: 1.0,
      color: [brighter],
      scale: sprite.scale,
      blendMode: 'ADD',
      frequency: 10
    })
}

export default class ArcEffect extends BaseEffect {

  cloud?: GameObjects.Particles.ParticleEmitter

  constructor(scene: Scene, public tower: TDTower, public dirAngle: number) {
    super(scene, tower, {
      singleEmitter: true,
      singleTarget: false
    })
  }

  initEmitter(i: number, emissionPoint: IPointLike, time: number) {
    if (this.tower.preview !== PreviewType.Drag) {
      const cloud = arcEmitter(this.tower, this.dirAngle)
      cloud.stop()
      this.add(cloud)
      this.tower.sendToBack(this)
    }
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number) {
    const cloud = this.getAt<GameObjects.Particles.ParticleEmitter>(0)
    if (this.tower.targeting.current.length) {
      cloud.start()
      // for (let target of this.tower.targeting.current) {
      //   const effectBuilder = this.damageEffectBuilder
      //   this.targetInstanceMap.apply(target, () => effectBuilder(target))
      // }
    } else { // No target
      cloud.stop()
    }
  }
}

export class PushEffect extends ArcEffect {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 0)
  }
}

export class FallEffect extends ArcEffect {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 90)
  }
}

export class PullEffect extends ArcEffect {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 180)
  }
}

export class RiseEffect extends ArcEffect {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 270)
  }
}
