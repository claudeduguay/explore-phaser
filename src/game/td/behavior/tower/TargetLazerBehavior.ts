import { GameObjects } from "phaser"
import BaseTargetBehavior from "./BaseTargetBehavior"
import Point, { IPointLike } from "../../../../util/geom/Point"
import TDTower from "../../entity/tower/TDTower"

export default class TargetLaserBehavior extends BaseTargetBehavior<GameObjects.Graphics> {

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    // For lazer we may not need to flash
    const show = time % 3000 > 500 // Visible 2500 of every 3000ms
    if (show) {
      const target = this.tower.targeting.current[0]
      if (target) {
        const emitter = this.tower.scene.add.graphics()
        this.draw(emitter, new Point(x, y), target)
        this.emitters?.push(emitter)
      }
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: IPointLike) {
    g.lineStyle(3, 0xFF0000, 1.0)
    g.lineBetween(source.x, source.y, target.x, target.y)
  }
}
