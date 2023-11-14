import { GameObjects } from "phaser"
import BaseBehavior from "./BaseBehavior"
import Point from "../../../../../util/geom/Point"
import TDTower from "../../../entity/tower/TDTower"

export default class LaunchBehavior extends BaseBehavior<GameObjects.Graphics> {

  fraction?: number

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    const target = this.tower.targeting.current[0]
    if (target) {
      const emitter = this.tower.scene.add.graphics()
      this.tower.effect.add(emitter)
      this.draw(emitter, new Point(x, y), new Point(target.x, target.y), time)
      // this.emitters?.push(emitter)
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: Point, time: number) {
    if (this.fraction === undefined) {
      this.fraction = 0
    }
    const s = this.asRelative(source)
    const t = this.asRelative(target)
    const pos = s.lerp(t, this.fraction)
    g.fillStyle(0xFF0000, 1.0)
    g.fillCircle(pos.x, pos.y, 7)
    this.fraction += 0.005
    if (this.fraction > 1) {
      this.fraction = undefined
    }

  }
}
