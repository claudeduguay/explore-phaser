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

export interface IEmitter {
  destroy: () => void
  stop?: () => void
}

// Base abstract class that lets us just add the addEmitter function to handle emitter creation
export default abstract class BaseTargetBehavior<T extends IEmitter> implements IBehavior<IHasTargets> {

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
    } else {
      this.removeOrStopEmitters()
    }
  }

  abstract addEmitter(index: number, emissionPoint: IHasPosition, obj: IHasTargets, time: number): void

  removeOrStopEmitters(): void {
    if (this.emitters?.length) {
      for (let emitter of this.emitters) {
        if (this.destroyEachFrame) {
          emitter.destroy()
        } else if (emitter.stop) {
          emitter.stop()
        }
      }
      if (this.destroyEachFrame) {
        this.emitters = []
      }
    }

  }
}
