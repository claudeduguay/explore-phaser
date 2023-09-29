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

  test?: GameObjects.Sprite[] = []
  muzzleFlash?: GameObjects.Sprite

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.muzzleFlash) {
      this.muzzleFlash.destroy()
    }
    if (this.test?.length) {
      for (let test of this.test) {
        test.destroy()
      }
      this.test = []
    }
    if (obj.targets.length > 0) {
      const show = time % 150 > 75 //  Visible half of every 150ms
      if (show) {
        // for (let i = 0; i < 3; i++) {
        //   const { x, y } = obj.emissionPoint(i)
        //   const test = obj.scene.add.sprite(x, y, "path-red")
        //   this.test?.push(test)
        // }

        const target = obj.targets[0]
        const angle = PMath.Angle.BetweenPoints(target, obj) + Math.PI / 2
        const { x, y } = obj.emissionPoint()

        this.muzzleFlash = obj.scene.add.sprite(x, y, "muzzle")
        this.muzzleFlash.setScale(0.075)
        this.muzzleFlash.rotation = angle - Math.PI
      }
    }
  }
}
