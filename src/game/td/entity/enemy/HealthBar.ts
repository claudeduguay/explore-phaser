import { Scene, GameObjects } from "phaser";

export default class HealthBar extends GameObjects.Graphics {

  _fraction: number = 1.0

  constructor(scene: Scene, public entity: any,
    public x: number, public y: number,
    public width: number = 30, public h: number = 5,
    public color: number = 0x00ff00) {
    super(scene)
    this.fillStyle(color, 0.8)
    this.fillRect(x, y, width, h)
  }

  get fraction() {
    return this._fraction
  }

  set fraction(fraction: number) {
    this._fraction = fraction
    this.clear()
    this.fillStyle(this.color, 0.8)
    this.fillRect(this.x, this.y, this.width * fraction, this.h)
  }
}
