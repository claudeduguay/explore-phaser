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
  emissionPoints: () => Point[]
}

export default class TargetLaserBehavior implements IBehavior<IHasTargets> {

  gs: GameObjects.Graphics[] = []

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.gs.length) {
      for (let g of this.gs) {
        g.destroy()
      }
      this.gs = []
    }
    if (obj.targets.length > 0) {
      const target = obj.targets[0]
      for (let { x, y } of obj.emissionPoints()) {
        const line = obj.scene.add.graphics({ lineStyle: { color: 0xFF0000, alpha: 1.0, width: 3 } })
          .lineBetween(x, y, target.x, target.y)
        this.gs.push(line)
      }
    }
  }
}
