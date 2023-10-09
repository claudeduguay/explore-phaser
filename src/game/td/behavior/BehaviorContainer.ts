
import { Scene, GameObjects } from "phaser"
import BehaviorList from "./BehaviorList"

export default class BehaviorContainer<T> extends GameObjects.Container {

  public readonly behavior = new BehaviorList<T>()

  constructor(public scene: Scene, x?: number, y?: number) {
    super(scene, x, y)
    scene.sys.updateList.add(this)
  }

  preUpdate(time: number, delta: number): void {
    this.behavior.update(this as any, time, delta)
  }
}
