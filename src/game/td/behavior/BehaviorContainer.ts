
import { Scene, GameObjects } from "phaser"
import BehaviorList from "./BehaviorList"

export default class BehaviorContainer extends GameObjects.Container {

  public readonly behavior = new BehaviorList()

  constructor(public scene: Scene, x?: number, y?: number) {
    super(scene, x, y)
    this.addToUpdateList()
  }

  preUpdate(time: number, delta: number): void {
    this.behavior.update(time, delta)
  }
}
