import { GameObjects, Math as PMath } from "phaser"
import BaseTargetBehavior, { ITarget, ITower } from "./BaseTargetBehavior"

export default class TargetBulletBehavior extends BaseTargetBehavior<GameObjects.Sprite> {

  constructor() {
    super(true)
  }

  addEmitter(i: number, { x, y }: ITarget, obj: ITower, time: number): void {
    const target = obj.targets[0]
    const show = time % 150 > 75 //  Visible half of every 150ms
    if (show) {
      const angle = PMath.Angle.BetweenPoints(target, obj) + Math.PI / 2
      const emitter = obj.scene.add.sprite(x, y, "muzzle")
      emitter.setScale(0.075)
      emitter.rotation = angle - Math.PI
      this.emitters?.push(emitter)
    }
  }
}
