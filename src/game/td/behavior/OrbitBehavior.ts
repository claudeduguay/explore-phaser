import { Math as PMath } from "phaser"
import IBehavior from "./IBehavior"

export interface IHasPosition {
  x: number
  y: number
}

export default class OrbitBehavior implements IBehavior<IHasPosition> {

  angle: number = 0

  constructor(public cx: number, public cy: number, public radius: number, public step: number = 1) {
  }

  update(obj: IHasPosition, time: number, delta: number) {
    const a = PMath.DegToRad(this.angle)
    obj.x = this.cx + Math.sin(a) * this.radius
    obj.y = this.cy + Math.cos(a) * this.radius
    this.angle += this.step
  }

}
