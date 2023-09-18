import { Math as PMath } from "phaser"
import IBehavior from "./IBehavior"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasAngle {
  rotation: number
}

export interface IHasTargets extends IHasPosition {
  turret: IHasAngle
  targets: IHasPosition[]
}

export default class TargetAimBehavior implements IBehavior<IHasTargets> {

  update(obj: IHasTargets, time: number, delta: number) {

    if (obj.targets.length > 0) {
      const target = obj.targets[0]
      obj.turret.rotation = PMath.Angle.BetweenPoints(target, obj) - Math.PI / 2
    }
  }

}
