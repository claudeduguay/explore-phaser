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
      this.draw(emitter, emissionPoint, target)
      this.emitters!.push(emitter)
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: IPointLike) {
    const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
    g.lineStyle(3, color, 1.0)
    g.lineBetween(source.x, source.y, target.x, target.y)
  }
}
