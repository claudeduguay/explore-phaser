
import { GameObjects, Scene } from "phaser"
import Point from "../../../util/Point"

export default class TDProjector extends GameObjects.Container {

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public key: string) {
    super(scene)
    const gun = this.scene.add.sprite(this.x, this.y, key)
    gun.setOrigin(0.5, 0)
    this.add(gun)
  }

  getOffset() {
    const texture = this.scene.textures.get(this.key)
    const source = texture?.source[0]
    return new Point(
      source?.height || 0,
      source?.width || 0)
  }

}
