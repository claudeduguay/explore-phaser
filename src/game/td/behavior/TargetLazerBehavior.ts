import { Scene, GameObjects } from "phaser"
import IBehavior from "./IBehavior"
import Point from "../../../util/Point"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  targets: IHasPosition[]
  emissionPoint: () => Point
}

export default class TargetLaserBehavior implements IBehavior<IHasTargets> {

  line?: GameObjects.Graphics

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.line) {
      this.line.destroy()
    }
    if (obj.targets.length > 0) {
      const { x, y } = obj.emissionPoint()
      const target = obj.targets[0]
      this.line = obj.scene.add.graphics({ lineStyle: { color: 0xFF0000, alpha: 1.0, width: 3 } })
        .lineBetween(x, y, target.x, target.y)
    }
  }
}
