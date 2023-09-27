import { Scene, GameObjects, Curves } from "phaser"
import IBehavior from "./IBehavior"
import Point from "../../../util/Point"
import { lerp } from "../../../util/MathUtil"


export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  targets: IHasPosition[]
}

export default class TargetLaserBehavior implements IBehavior<IHasTargets> {

  g?: GameObjects.Graphics

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (obj.targets.length > 0) {
      const target = obj.targets[0]
      const path = new Curves.Path()
      const objP = new Point(obj.x, obj.y)
      const targetP = new Point(target.x, target.y)
      const deviation = 20
      // Need to make distrotions perpendicular
      const distort = () => new Point(
        lerp(-deviation, deviation, Math.random()),
        lerp(-deviation, deviation, Math.random()))
      path.moveTo(obj.x, obj.y)
      const divCount = 3
      for (let i = 0; i < divCount; i++) {
        const mid = targetP.lerp(objP, i / divCount).plus(distort())
        path.lineTo(mid.x, mid.y)
      }
      path.lineTo(target.x, target.y)

      this.g = obj.scene.add.graphics({ lineStyle: { color: 0x00FFFF, alpha: 1.0, width: 1 } })
      path.draw(this.g)
    }
  }
}
