import { Scene, GameObjects } from "phaser";

export default class HealthBar extends GameObjects.Graphics {

  _fraction: number = 1.0

  constructor(scene: Scene, public entity: any,
    public x: number, public y: number,
    public w: number = 30, public h: number = 5,
    public color: number = 0x00ff00) {
    super(scene)
    this.fillStyle(color, 0.8)
    this.fillRect(x, y, w, h)
  }

  get fraction() {
    return this._fraction
  }

  set fraction(fraction: number) {
    this._fraction = fraction
    this.clear()
    this.fillStyle(this.color, 0.8)
    this.fillRect(this.x, this.y, this.w * fraction, this.h)
  }
}
