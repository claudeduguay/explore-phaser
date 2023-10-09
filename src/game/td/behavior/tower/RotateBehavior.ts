import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../core/IBehavior"

export interface IHasAngle {
  angle: number
}

export default class RotateBehavior implements IBehavior<TDTower> {

  constructor(public step: number = 1) {

  }

  update(tower: TDTower, time: number, delta: number) {
    tower.turret.angle += this.step
  }

}
