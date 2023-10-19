import { GameObjects, Math as PMath } from "phaser"
import Point from "../../../../util/geom/Point"
import { rotation } from "../../../../util/MathUtil"
import BaseTargetBehavior from "./BaseTargetBehavior"
import TDTower from "../../entity/tower/TDTower"

function perpendicular({ x, y }: Point, angle: number, r: number, pos: boolean = true) {
  return rotation(x, y, r, r, angle + (pos ? 0 : -Math.PI))
}

export default class TargetPlasmaBehavior extends BaseTargetBehavior<GameObjects.Graphics> {

  constructor(tower: TDTower) {
    super(tower, true)
  }

  addEmitter(i: number, { x, y }: Point, time: number): void {
    const target = this.tower.targeting.current[0]
    if (target) {
      const emitter = this.tower.scene.add.graphics()
      this.draw(emitter, new Point(x, y), new Point(target.x, target.y))
      this.emitters?.push(emitter)
    }
  }

  draw(g: GameObjects.Graphics, source: Point, target: Point) {
    g.lineStyle(2, 0x0000FF, 1.0)
    const divisions = 7
    const deviation = 10
    const angle = PMath.Angle.BetweenPoints(source, target)

    // Collect source, ...midpoints, target (x and y coordinates)
    const xs: number[] = [source.x]
    const ys: number[] = [source.y]
    for (let i = 1; i < divisions; i++) {
      const mid = source.lerp(target, i / divisions)
      const p = perpendicular(mid, angle, deviation * Math.random(), i % 2 === 0)
      xs.push(p.x)
      ys.push(p.y)
    }
    xs.push(target.x)
    ys.push(target.y)

    // Draw interpolated curve (every 3 pixels)
    const divs = source.diff(target).length() / 3
    for (let i = 0; i < divs; i++) {
      const x = PMath.Interpolation.CatmullRom(xs, i / divs)
      const y = PMath.Interpolation.CatmullRom(ys, i / divs)
      if (i === 0) {
        g.moveTo(x, y)
      } else {
        g.lineTo(x, y)
      }
    }
    g.stroke()
  }
}

// export function testPlasmaPath(scene: Scene, source = new Point(50, 760), target = new Point(250, 760)) {
//   const g = scene.add.graphics()
//   const b = new TargetPlasmaBehavior()
//   b.draw(g, source, target)
// }
