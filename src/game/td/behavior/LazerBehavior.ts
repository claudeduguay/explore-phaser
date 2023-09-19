import { Scene, GameObjects } from "phaser"
import IBehavior from "./IBehavior"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  targets: IHasPosition[]
}

export default class LaserBehavior implements IBehavior<IHasTargets> {

  line?: GameObjects.Graphics

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.line) {
      this.line.destroy()
    }
    if (obj.targets.length > 0) {
      const target = obj.targets[0]
      // console.log("Laster:", target)
      this.line = obj.scene.add.graphics({ lineStyle: { color: 0xFF0000, alpha: 1.0, width: 3 } })
        .lineBetween(obj.x, obj.y, target.x, target.y)
    }
  }
}
