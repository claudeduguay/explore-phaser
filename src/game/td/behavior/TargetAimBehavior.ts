import { GameObjects, Math as PMath, Scene } from "phaser"
import IBehavior from "./IBehavior"
// import { rotation } from "../../../util/MathUtil"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasAngle {
  rotation: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  turret: IHasAngle
  targets: IHasPosition[]
}

export default class TargetAimBehavior implements IBehavior<IHasTargets> {

  g!: GameObjects.Graphics

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (obj.targets.length > 0) {
      const target = obj.targets[0]
      obj.turret.rotation = PMath.Angle.BetweenPoints(target, obj) - Math.PI / 2

      // Test rotation util
      // const p = rotation(obj.x, obj.y, 64, 64, obj.turret.rotation)
      // this.g = obj.scene.add.graphics({ lineStyle: { color: 0xff0000, width: 3 } })
      // this.g.moveTo(obj.x, obj.y)
      // this.g.lineTo(p.x, p.y)
      // this.g.stroke()
    }
  }

}
