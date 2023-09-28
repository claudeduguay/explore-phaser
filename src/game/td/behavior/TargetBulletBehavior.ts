import { Scene, GameObjects, Math as PMath } from "phaser"
import IBehavior from "./IBehavior"
import Point from "../../../util/Point"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  emissionPoint: (index?: number) => Point
  targets: IHasPosition[]
}

export default class TargetBulletBehavior implements IBehavior<IHasTargets> {

  muzzleFlash?: GameObjects.Sprite

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.muzzleFlash) {
      this.muzzleFlash.destroy()
    }
    if (obj.targets.length > 0) {
      const show = true // time % 150 > 75 //  Visible half of every 150ms
      if (show) {
        // const target = obj.targets[0]
        // const angle = PMath.Angle.BetweenPoints(target, obj) + Math.PI / 2
        const { x, y } = obj.emissionPoint()

        // muzzle
        this.muzzleFlash = obj.scene.add.sprite(x, y, "path-red") //.setOrigin(0, 0.5)
        // this.muzzleFlash.setScale(0.075)
        // this.muzzleFlash.rotation = angle - Math.PI
      }
    }
  }
}
