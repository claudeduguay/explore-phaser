
import { GameObjects, Scene } from "phaser"
import Point from "../../../../util/geom/Point"

export default class TDWeapon extends GameObjects.Container {

  sprite!: GameObjects.Sprite

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public key: string) {
    super(scene)
    this.sprite = this.scene.add.sprite(this.x, this.y, key)
    this.sprite.setOrigin(0.5, 0)
    this.add(this.sprite)
  }

  getSize() {
    return new Point(this.sprite.width, this.sprite.height)
  }

}
