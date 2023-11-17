import { GameObjects, Math as PMath, Scene } from "phaser"
import BaseBehavior from "./BaseBehavior"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import TDTower from "../../../entity/tower/TDTower"
import { pickFirst } from "../../../entity/tower/Targeting"
import { DAMAGE_DATA, DELIVERY_DATA } from "../../../entity/model/ITowerData"

export default class LaunchBehavior extends BaseBehavior {

  fraction: number[] = []

  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, {
      singleEmitter: false,
      singleTarget: true
    })
  }

  initEmitter(i: number, { x, y }: IPointLike, time: number): void {
    const target = pickFirst(this.tower.targeting.current)
    if (target) {
      const key = DELIVERY_DATA[this.tower.model.organize.delivery].sprite.key
      const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
      const emitter = this.scene.add.sprite(x, y, key)
      if (this.fraction.length < i + 1) {
        this.fraction.push(0)
      }
      emitter.setTint(color)
      this.add(emitter)
    }
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number): void {
    const target = pickFirst(this.tower.targeting.current)
    if (target) {
      const emitter = this.getAt<GameObjects.Sprite>(i)
      this.draw(i, emitter, emissionPoint, new Point(target.x, target.y), time)
      this.fraction[i] += 0.04
      if (this.fraction[i] > 1) {
        this.fraction[i] = 0
      }
    } else {
      this.fraction[i] = 0
    }
  }

  draw(i: number, emitter: GameObjects.Sprite, source: IPointLike, target: Point, time: number) {
    const s = this.asRelative(source)
    const t = this.asRelative(target)
    const pos = s.lerp(t, this.fraction[i])
    emitter.setPosition(pos.x, pos.y)
    emitter.rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI / 2
  }
}
