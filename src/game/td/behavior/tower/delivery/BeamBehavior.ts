import { GameObjects } from "phaser"
import BaseBehavior from "./BaseBehavior"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import TDTower from "../../../entity/tower/TDTower"
import { pickFirst } from "../../../entity/tower/Targeting"

export default class BeamBehavior extends BaseBehavior<GameObjects.Graphics> {

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, emissionPoint: Point, time: number): void {
    const target = pickFirst(this.tower.targeting.current)
    if (target) {
      const emitter = this.tower.scene.add.graphics()
      this.tower.effect.add(emitter)
      this.draw(emitter, emissionPoint, target)
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: IPointLike) {
    const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
    const { x: x1, y: y1 } = this.asRelative(source)
    const { x: x2, y: y2 } = this.asRelative(target)
    g.lineStyle(3, color, 1.0)
    g.lineBetween(x1, y1, x2, y2)
  }
}
