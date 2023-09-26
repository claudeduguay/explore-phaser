import { Scene, GameObjects, Math as PMath } from "phaser"
import IBehavior from "./IBehavior"
import ITowerModel from "../model/ITowerModel"
import { toRadians } from "../assets/util/MathUtil"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  model: ITowerModel
  turret: { angle: number, rotation: number }
  targets: IHasPosition[]
}

export default class TargetBoostBehavior implements IBehavior<IHasTargets> {

  g?: GameObjects.Graphics

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (obj.targets.length > 0) {
      const slice = 20
      this.g = obj.scene.add.graphics({ fillStyle: { color: 0x00ff00, alpha: 0.1 } })
      for (let a = 0; a < 360; a += slice * 2)
        this.g.slice(obj.x, obj.y, obj.model.stats.range,
          toRadians(obj.turret.angle + a),
          toRadians(obj.turret.angle + a + slice)
        ).fill()
    }
  }
}
