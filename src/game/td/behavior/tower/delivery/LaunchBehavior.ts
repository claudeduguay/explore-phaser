import { GameObjects, Math as PMath } from "phaser"
import BaseBehavior from "./BaseBehavior"
import Point from "../../../../../util/geom/Point"
import TDTower from "../../../entity/tower/TDTower"
import { pickFirst } from "../../../entity/tower/Targeting"
import { DAMAGE_DATA, DELIVERY_DATA } from "../../../entity/model/ITowerData"

export default class LaunchBehavior extends BaseBehavior<GameObjects.Graphics> {

  fraction?: number

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    const target = pickFirst(this.tower.targeting.current)
    if (target) {
      const key = DELIVERY_DATA[this.tower.model.organize.delivery].sprite.key
      const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
      const emitter = this.tower.scene.add.sprite(0, 0, key)
      emitter.setTint(color)
      this.tower.effect.add(emitter)
      this.draw(emitter, new Point(x, y), new Point(target.x, target.y), time)
    }
  }

  draw(emitter: GameObjects.Sprite, source: Point, target: Point, time: number) {
    if (this.fraction === undefined) {
      this.fraction = 0
    }
    const s = this.asRelative(source)
    const t = this.asRelative(target)
    const pos = s.lerp(t, this.fraction)
    emitter.setPosition(pos.x, pos.y)
    emitter.rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI / 2
    this.fraction += 0.005
    if (this.fraction > 1) {
      this.fraction = undefined
    }

  }
}
