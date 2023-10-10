import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../core/IBehavior"

export interface IHasAngle {
  angle: number
}

export default class RotateBehavior implements IBehavior {

  constructor(public tower: TDTower, public step: number = 1) {

  }

  update(time: number, delta: number) {
    this.tower.turret.angle += this.step
  }

}
