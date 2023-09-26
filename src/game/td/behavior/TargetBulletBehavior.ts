import { Scene, GameObjects, Math as PMath } from "phaser"
import IBehavior from "./IBehavior"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  targets: IHasPosition[]
}

export default class TargetBulletBehavior implements IBehavior<IHasTargets> {

  muzzleFlash?: GameObjects.Sprite

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.muzzleFlash) {
      this.muzzleFlash.destroy()
    }
    if (obj.targets.length > 0) {
      const show = time % 150 > 75 //  Visible half of every 150ms
      if (show) {
        const target = obj.targets[0]
        const angle = PMath.Angle.BetweenPoints(target, obj) + Math.PI / 2
        this.muzzleFlash = obj.scene.add.sprite(obj.x, obj.y, "muzzle")
        this.muzzleFlash.setScale(0.1)
        this.muzzleFlash.rotation = angle
      }
    }
  }
}
