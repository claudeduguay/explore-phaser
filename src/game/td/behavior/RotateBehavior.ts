import IBehavior from "./IBehavior"

export interface IHasAngle {
  angle: number
}

export default class RotateBehavior implements IBehavior<IHasAngle> {

  update(obj: IHasAngle, time: number, delta: number) {
    obj.angle += 1
  }

}
