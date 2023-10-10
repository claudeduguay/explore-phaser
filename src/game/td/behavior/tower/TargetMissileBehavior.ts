import { GameObjects } from "phaser"
import BaseTargetBehavior from "./BaseTargetBehavior"
import Point from "../../../../util/Point"
import TDTower from "../../entity/tower/TDTower"

export default class TargetMissileBehavior extends BaseTargetBehavior<GameObjects.Graphics> {

  fraction?: number

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    const target = this.tower.targets[0]
    if (target) {
      const emitter = this.tower.scene.add.graphics()
      this.draw(emitter, new Point(x, y), new Point(target.x, target.y), time)
      this.emitters?.push(emitter)
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: Point, time: number) {
    if (this.fraction === undefined) {
      this.fraction = 0
    }
    const pos = source.lerp(target, this.fraction)
    g.fillStyle(0xFF0000, 1.0)
    g.fillCircle(pos.x, pos.y, 7)
    this.fraction += 0.005
    if (this.fraction > 1) {
      this.fraction = undefined
    }

  }
}
