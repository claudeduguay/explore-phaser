import { Scene, GameObjects } from "phaser"
import IBehavior from "./IBehavior"
import ITowerModel from "../model/ITowerModel"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  model: ITowerModel
  turret: { angle: number, rotation: number }
  targets: IHasPosition[]
}

export default class TargetSlowBehavior implements IBehavior<IHasTargets> {

  g?: GameObjects.Graphics

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (obj.targets.length > 0) {
      this.g = obj.scene.add.graphics({
        fillStyle: { color: 0xff0000, alpha: 0.2 },
        lineStyle: { color: 0xff0000, alpha: 0.75, width: 2 }
      })
      const f = time % 1000 / 1000
      const r1 = obj.model.stats.range * f
      const r2 = obj.model.stats.range - r1
      this.g.fillCircle(obj.x, obj.y, r1)
      this.g.fillCircle(obj.x, obj.y, r2)
      this.g.strokeCircle(obj.x, obj.y, r1)
      this.g.strokeCircle(obj.x, obj.y, r2)
    }
  }
}
