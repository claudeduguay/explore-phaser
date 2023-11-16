import { GameObjects, Math as PMath, Display, Scene } from "phaser"
import IBehavior from "../../core/IBehavior"
import { rangeDeathZone, topEmitZone, bottomEmitZone, eastEmitZone, westEmitZone } from "../../../emitter/ParticleConfig"
import TDTower, { PreviewType } from "../../../entity/tower/TDTower"
import TDEnemy from "../../../entity/enemy/TDEnemy"
import DamageEffect from "../../enemy/DamageEffect"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import { IPointLike } from "../../../../../util/geom/Point"
import BaseBehavior from "./BaseBehavior"

export type IDamageEffectBuilder = (enemy: TDEnemy) => IBehavior

// BUG: Something is wrong with this class as direction is not set correctly

export function arcEmitter(tower: TDTower, angle: number): GameObjects.Particles.ParticleEmitter {
  const range = tower.model.general.range
  const { damage } = tower.model.organize
  const { color, sprite } = DAMAGE_DATA[damage]
  const c = Display.Color.IntegerToColor(color.value)
  const brighter = c.brighten(50).color
  let emitZone // = topEmitZone(range, tower)
  switch (angle) {
    case 0:
      emitZone = westEmitZone(range, tower)
      console.log("Created:", angle, "west")
      break
    case 90:
      emitZone = topEmitZone(range, tower)
      console.log("Created:", angle, "top")
      break
    case 180:
      emitZone = eastEmitZone(range, tower)
      console.log("Created:", angle, "east")
      break
    case 270:
    case -90:
      emitZone = bottomEmitZone(range, tower)
      console.log("Created:", angle, "bottom")
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

export default class ArcBehaviors extends BaseBehavior {

  cloud?: GameObjects.Particles.ParticleEmitter

  constructor(scene: Scene, public tower: TDTower, public angle: number) {
    super(scene, tower, {
      destroyEachFrame: false,
      singleEmitter: true,
      singleTarget: false
    })
  }

  // We know that if a tower has no duration it's a range effect
  damageEffectBuilder: IDamageEffectBuilder = (target: TDEnemy) => new DamageEffect(this.tower, target)

  initEmitter(i: number, emissionPoint: IPointLike, time: number) {
    if (this.tower.preview !== PreviewType.Drag) {
      const cloud = arcEmitter(this.tower, this.angle)
      cloud.stop()
      this.add(cloud)
      this.tower.sendToBack(this)
    }
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number) {
    const cloud = this.list[0] as GameObjects.Particles.ParticleEmitter
    if (this.tower.targeting.current.length) {
      cloud.start()
      for (let target of this.tower.targeting.current) {
        const effectBuilder = this.damageEffectBuilder
        this.targetInstanceMap.apply(target, () => effectBuilder(target))
      }
    } else { // No target
      cloud.stop()
    }
  }
}

export class PushBehavior extends ArcBehaviors {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 0)
  }
}

export class FallBehavior extends ArcBehaviors {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 90)
  }
}

export class PullBehavior extends ArcBehaviors {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 180)
  }
}

export class RiseBehavior extends ArcBehaviors {
  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, 270)
  }
}
