import TDTower from "../../entity/tower/TDTower"
import IBehavior from "../IBehavior"

export default class TargetsClearBehavior implements IBehavior<TDTower> {
  update(tower: TDTower, time: number, delta: number) {
    if (!tower.preview) {
      tower.targets = []
    }
  }
}
