import { GameObjects, Math as PMath } from "phaser"
import BaseTargetBehavior, { ITarget, ITower } from "./BaseTargetBehavior"

export default class TargetBulletBehavior extends BaseTargetBehavior<GameObjects.Sprite> {

  constructor() {
    super(true)
  }

  addEmitter(i: number, { x, y }: ITarget, tower: ITower, time: number): void {
    const target = tower.targets[0]
    const show = time % 150 > 75 //  Visible half of every 150ms
    if (show) {
      const angle = PMath.Angle.BetweenPoints(target, tower) + Math.PI / 2
      const emitter = tower.scene.add.sprite(x, y, "muzzle")
      emitter.setOrigin(0.5, 0.8)
      emitter.setScale(0.075)
      emitter.alpha = 0.75
      emitter.rotation = angle - Math.PI
      this.emitters?.push(emitter)
    }
  }
}
