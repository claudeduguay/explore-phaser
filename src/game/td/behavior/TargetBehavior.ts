import { Math as PMath } from "phaser"
import IBehavior from "./IBehavior"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasAngle {
  rotation: number
}

export interface IHasTarget extends IHasPosition {
  turret: IHasAngle
  target?: IHasPosition
}

export default class TargetBehavior implements IBehavior<IHasTarget> {

  update(obj: IHasTarget, time: number, delta: number) {

    if (obj.target) {
      obj.turret.rotation = PMath.Angle.BetweenPoints(obj.target, obj) - Math.PI / 2
    }
  }

}
