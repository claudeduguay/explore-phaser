import { GameObjects } from "phaser"
import BaseTargetBehavior, { IHasPosition, IHasTargets } from "./BaseTargetBehavior"
import Point from "../../../util/Point"

export default class TargetLaserBehavior extends BaseTargetBehavior<GameObjects.Graphics> {

  constructor() {
    super(true)
  }

  addEmitter(i: number, { x, y }: IHasPosition, obj: IHasTargets, time: number): void {
    // For lazer we may not need to flash
    const show = time % 150 > 75 //  Visible half of every 150ms
    if (show) {
      const target = obj.targets[0]
      if (target) {
        const emitter = obj.scene.add.graphics()
        this.draw(emitter, new Point(x, y), new Point(target.x, target.y))
        this.emitters?.push(emitter)
      }
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: Point) {
    g.lineStyle(3, 0xFF0000, 1.0)
    g.lineBetween(source.x, source.y, target.x, target.y)
  }
}
