import { GameObjects, Math as PMath } from "phaser"
import BaseTargetBehavior from "../BaseTargetBehavior"
import TDTower from "../../../entity/tower/TDTower"
import Point from "../../../../../util/geom/Point"
import { pickFirst } from "../../../entity/tower/Targeting"
// import { DAMAGE_DATA } from "../../../entity/model/ITowerData"

export default class BulletBehavior extends BaseTargetBehavior<GameObjects.Sprite> {

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    const target = pickFirst(this.tower.targeting.current)
    const show = time % 150 > 75 //  Visible half of every 150ms
    if (target && show) {
      // const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
      const angle = PMath.Angle.BetweenPoints(target, this.tower) + Math.PI / 2
      const emitter = this.tower.scene.add.sprite(x, y, "muzzle")
      // emitter.setTint(color)
      emitter.setOrigin(0.5, 0.9)
      emitter.setScale(0.075)
      emitter.alpha = 0.75
      emitter.rotation = angle - Math.PI
      this.emitters?.push(emitter)
    }
  }
}
