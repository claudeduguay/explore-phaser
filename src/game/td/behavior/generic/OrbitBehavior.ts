import { Math as PMath } from "phaser"
import IBehavior from "../core/IBehavior"

export interface IHasPosition {
  x: number
  y: number
}

export default class OrbitBehavior implements IBehavior<IHasPosition> {

  constructor(
    public cx: number,
    public cy: number,
    public rx: number,
    public ry: number = rx,
    public angle: number = 0,
    public step: number = 1) {
  }

  update(obj: IHasPosition, time: number, delta: number) {
    const a = PMath.DegToRad(this.angle)
    // console.log("Angle, Radians:", this.angle, a)
    obj.x = this.cx + Math.sin(a) * this.rx
    obj.y = this.cy + Math.cos(a) * this.ry
    this.angle += this.step
  }

}
