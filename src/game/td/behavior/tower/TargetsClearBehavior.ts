import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../core/IBehavior"

export default class TargetsClearBehavior implements IBehavior<TDTower> {

  constructor(public tower: TDTower) {
  }

  update(tower: TDTower, time: number, delta: number) {
    if (!tower.preview) {
      tower.targets = []
    }
  }
}
