import IBehavior from "./IBehavior"

export interface IHasAngle {
  angle: number
}

export default class RotateBehavior implements IBehavior<IHasAngle> {

  constructor(public step: number = 1) {

  }

  update(obj: IHasAngle, time: number, delta: number) {
    obj.angle += this.step
  }

}
