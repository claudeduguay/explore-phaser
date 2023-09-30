import { ITower } from "./BaseTargetBehavior"
import IBehavior from "./IBehavior"

export default class TargetsClearBehavior implements IBehavior<ITower> {
  update(tower: ITower, time: number, delta: number) {
    tower.targets = []
  }
}
