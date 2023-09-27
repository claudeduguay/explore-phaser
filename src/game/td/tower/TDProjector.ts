
import { GameObjects, Scene } from "phaser"

export default class TDProjector extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public key: string) {
    super(scene)
    const gun = this.scene.add.sprite(this.x, this.y, key)
    gun.setOrigin(0.5, 0)
    this.add(gun)
  }

  getOffset() {
    const texture = this.scene.textures.get(this.key)
    return (texture?.source[0].height || 0)
  }

}
