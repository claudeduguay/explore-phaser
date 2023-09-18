import IBehavior from "./IBehavior"

export interface IHasTargets {
  targets: any[]
}

export default class TargetsClearBehavior implements IBehavior<IHasTargets> {
  update(obj: IHasTargets, time: number, delta: number) {
    obj.targets = []
  }
}
