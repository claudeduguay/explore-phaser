import { Scene, GameObjects } from "phaser";

export default class TDRange extends GameObjects.Container {
  constructor(scene: Scene, x: number, y: number, range: number) {
    super(scene)
    const g = scene.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0.1 } })
      .fillCircle(x, y, range)
    this.add(g)
  }
}
