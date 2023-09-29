import { Scene } from "phaser"
import IBehavior from "./IBehavior"
import ITowerModel from "../model/ITowerModel"

export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  model: ITowerModel
  emissionPoints: () => IHasPosition[]
  targets: IHasPosition[]
}


// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseTargetBehavior<T extends { destroy: () => void } = any> implements IBehavior<IHasTargets> {

  emitters: T[] = []

  constructor(public destroyEachFrame: boolean = true) {
  }

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.destroyEachFrame && this.emitters?.length) {
      for (let emitter of this.emitters) {
        emitter.destroy()
      }
      this.emitters = []
    }
    if (obj.targets.length > 0) {
      obj.emissionPoints().forEach((point, i) => this.addEmitter(i, point, obj, time))
    }
  }

  abstract addEmitter(index: number, emissionPoint: IHasPosition, obj: IHasTargets, time: number): void
  //  {
  //   const show = time % 150 > 75 //  Visible half of every 150ms
  //   if (show) {
  //     const angle = PMath.Angle.BetweenPoints(target, obj) + Math.PI / 2
  //     const emitter = obj.scene.add.sprite(x, y, "muzzle")
  //     emitter.setScale(0.075)
  //     emitter.rotation = angle - Math.PI
  //     this.emitters?.push(emitter)
  //   }
  // }
}
