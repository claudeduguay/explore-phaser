import { GameObjects, Math as PMath } from "phaser"
import BaseTargetBehavior from "./BaseTargetBehavior"
import TDTower from "../../entity/tower/TDTower"
import Point from "../../../../util/Point"

export default class TargetBulletBehavior extends BaseTargetBehavior<GameObjects.Sprite> {

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    const target = this.tower.targeting.current[0]
    const show = time % 150 > 75 //  Visible half of every 150ms
    if (show) {
      const angle = PMath.Angle.BetweenPoints(target, this.tower) + Math.PI / 2
      const emitter = this.tower.scene.add.sprite(x, y, "muzzle")
      emitter.setOrigin(0.5, 0.8)
      emitter.setScale(0.075)
      emitter.alpha = 0.75
      emitter.rotation = angle - Math.PI
      this.emitters?.push(emitter)
    }
  }
}
