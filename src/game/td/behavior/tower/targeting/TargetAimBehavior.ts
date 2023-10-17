import { GameObjects, Math as PMath } from "phaser"
import IBehavior from "../../core/IBehavior"
import TDTower from "../../../entity/tower/TDTower"

export default class TargetAimBehavior implements IBehavior {

  g!: GameObjects.Graphics

  constructor(public tower: TDTower) {
  }

  update(time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (this.tower.targeting.current.length > 0) {
      const target = this.tower.targeting.current[0]
      this.tower.turret.rotation = PMath.Angle.BetweenPoints(target, this.tower) - Math.PI / 2

      // Test rotation util
      // const p = rotation(obj.x, obj.y, 64, 64, obj.turret.rotation)
      // this.g = obj.scene.add.graphics({ lineStyle: { color: 0xff0000, width: 3 } })
      // this.g.moveTo(obj.x, obj.y)
      // this.g.lineTo(p.x, p.y)
      // this.g.stroke()
    }
  }

}
