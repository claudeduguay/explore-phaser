import { Scene, GameObjects, Math as PMath } from "phaser"
import Point from "../../../util/Point"
import { rotation } from "../../../util/MathUtil"
import BaseTargetBehavior, { IHasPosition, IHasTargets } from "./BaseTargetBehavior"

function perpendicular({ x, y }: Point, angle: number, r: number, pos: boolean = true) {
  return rotation(x, y, r, r, angle + (pos ? 0 : -Math.PI))
}

export default class TargetPlasmaBehavior extends BaseTargetBehavior<GameObjects.Graphics> {

  constructor() {
    super(true)
  }

  addEmitter(i: number, { x, y }: IHasPosition, obj: IHasTargets, time: number): void {
    const target = obj.targets[0]
    if (target) {
      const emitter = obj.scene.add.graphics()
      this.draw(emitter, new Point(x, y), new Point(target.x, target.y))
      this.emitters?.push(emitter)
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: Point) {
    g.lineStyle(2, 0x00FFFF, 1.0)
    const divisions = 7
    const deviation = 10
    const angle = PMath.Angle.BetweenPoints(source, target)

    // Collect source, ...midpoints, target
    const points: Point[] = []
    points.push(source)
    for (let i = 1; i < divisions; i++) {
      const mid = source.lerp(target, i / divisions)
      const p = perpendicular(mid, angle, deviation * Math.random(), i % 2 === 0)
      points.push(p)
    }
    points.push(target)

    // Map each axis (for CatmulRom)
    const xs = points.map(p => p.x)
    const ys = points.map(p => p.x)

    // Collect curve points (every 3 pixels)
    const curve: Point[] = []
    const divs = source.diff(target).length() / 3
    for (let i = 0; i < divs; i++) {
      const x = PMath.Interpolation.CatmullRom(xs, i / divs)
      const y = PMath.Interpolation.CatmullRom(ys, i / divs)
      curve.push(new Point(x, y))
    }
    // Draw interpolated curve
    for (let i = 0; i < curve.length; i++) {
      const p = curve[i]
      if (i === 0) {
        g.moveTo(p.x, p.y)
      } else {
        g.lineTo(p.x, p.y)
      }
    }
    g.stroke()
  }
}

export function testPlasmaPath(scene: Scene, source = new Point(50, 760), target = new Point(250, 760)) {
  const g = scene.add.graphics()
  const b = new TargetPlasmaBehavior()
  b.draw(g, source, target)
}
