import { GameObjects, Math as PMath } from "phaser"
import BaseEffect from "./BaseEffect"
import { IPointLike } from "../../../../../util/geom/Point"
import TDTower from "../../../entity/tower/TDTower"
import { DAMAGE_DATA, DELIVERY_DATA } from "../../../entity/model/ITowerData"

export default class LaunchEffect extends BaseEffect {

  fraction: number[] = []

  constructor(tower: TDTower) {
    super(tower, {
      singleEmitter: false,
      singleTarget: true
    })
  }

  launchSprite(x: number, y: number, key: string) {
    return this.scene.add.sprite(x, y, key)
  }

  initEmitter(i: number, { x, y }: IPointLike, time: number): void {
    const target = this.singlePickStrategy(this.tower)
    if (target) {
      const key = DELIVERY_DATA[this.tower.model.organize.delivery].sprite.key
      const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
      const emitter = this.launchSprite(x, y, key)
      if (this.fraction.length < i + 1) {
        this.fraction.push(0)
      }
      emitter.setTint(color)
      this.add(emitter)
    }
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number): void {
    const target = this.singlePickStrategy(this.tower)
    if (target) {
      const emitter = this.getAt<GameObjects.Sprite>(i)
      this.draw(i, emitter, emissionPoint, target, time)
      this.fraction[i] += 0.04
      if (this.fraction[i] > 1) {
        this.fraction[i] = 0
      }
    } else {
      this.fraction[i] = 0
    }
  }

  clearEmitter(i: number, emissionPoint: IPointLike, time: number): void {
    const emitter = this.getAt<GameObjects.Sprite>(i)
    if (emitter) {
      emitter.visible = false
    }
  }

  draw(i: number, emitter: GameObjects.Sprite, source: IPointLike, target: IPointLike, time: number) {
    const s = this.asRelative(source)
    const t = this.asRelative(target)
    const pos = s.lerp(t, this.fraction[i])
    emitter.visible = true
    emitter.setPosition(pos.x, pos.y)
    emitter.rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI / 2
  }
}
