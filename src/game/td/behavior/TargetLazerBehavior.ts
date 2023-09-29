import BaseTargetBehavior, { IHasPosition, IHasTargets } from "./BaseTargetBehavior"

export default class TargetLaserBehavior extends BaseTargetBehavior {

  constructor() {
    super(true)
  }

  addEmitter(i: number, { x, y }: IHasPosition, obj: IHasTargets, time: number): void {
    // For lazer we may not need to flash
    const show = time % 150 > 75 //  Visible half of every 150ms
    if (show) {
      const target = obj.targets[0]
      if (target) {
        const emitter = obj.scene.add.graphics({ lineStyle: { color: 0xFF0000, alpha: 1.0, width: 3 } })
          .lineBetween(x, y, target.x, target.y)
        this.emitters?.push(emitter)
      }
    }
  }
}
