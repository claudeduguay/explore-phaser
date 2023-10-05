import { GameObjects } from "phaser"
import BaseTargetBehavior, { ITarget, ITower } from "./BaseTargetBehavior"
import Point from "../../../util/Point"

export default class TargetLaserBehavior extends BaseTargetBehavior<GameObjects.Graphics> {

  constructor() {
    super(true)
  }

  addEmitter(i: number, { x, y }: ITarget, tower: ITower, time: number): void {
    // For lazer we may not need to flash
    const show = time % 3000 <= 2500 // Visible 2500 of every 3000ms
    if (show) {
      const target = tower.targets[0]
      if (target) {
        const emitter = tower.scene.add.graphics()
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
