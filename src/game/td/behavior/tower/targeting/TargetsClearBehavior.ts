import TDTower from "../../../entity/tower/TDTower"
import IBehavior from "../../core/IBehavior"

export default class TargetsClearBehavior implements IBehavior {

  constructor(public tower: TDTower) {
  }

  update(time: number, delta: number) {
    if (!this.tower.preview) {
      this.tower.targeting.clear()
    }
  }
}
