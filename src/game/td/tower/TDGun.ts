
import { GameObjects, Scene } from "phaser"

export default class TDGun extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x, key: string) {
    super(scene)
    const gun = this.scene.add.sprite(this.x, this.y, key)
    gun.setOrigin(0.5, 0)
    this.add(gun)
  }
}
