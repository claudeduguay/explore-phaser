import { GameObjects, Curves, Math as PMath } from "phaser"
import BaseBehavior from "./BaseBehavior"
import Point, { IPointLike } from "../../../../../util/geom/Point"
import { DAMAGE_DATA } from "../../../entity/model/ITowerData"
import TDTower from "../../../entity/tower/TDTower"
import { pickFirst } from "../../../entity/tower/Targeting"
import { rotation } from "../../../../../util/MathUtil"

function perpendicular({ x, y }: Point, angle: number, r: number, pos: boolean = true) {
  return rotation(x, y, r, r, angle + (pos ? 0 : -Math.PI))
}

export default class BeamBehavior extends BaseBehavior {

  constructor(tower: TDTower) {
    super(tower, {
      destroyEachFrame: true,
      singleEmitter: false,
      singleTarget: true
    })
  }

  initEmitter(i: number, emissionPoint: IPointLike, time: number): void {
    const emitter = this.tower.scene.add.graphics()
    this.tower.effect.add(emitter)
  }

  updateEmitter(i: number, emissionPoint: IPointLike, time: number): void {
    const emitter = this.tower.effect.list[i] as GameObjects.Graphics
    const target = pickFirst(this.tower.targeting.current)
    if (target) {
      const source = this.asRelative(emissionPoint)
      switch (this.tower.model.organize.damage) {
        case "Electric":
          this.drawLightning(emitter, source, this.asRelative(target))
          break
        case "Plasma":
          this.drawPlasma(emitter, source, this.asRelative(target))
          break
        default:
          this.drawLine(emitter, source, this.asRelative(target))
      }
    }
  }

  drawLine(g: GameObjects.Graphics, source: Point, target: Point) {
    const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
    const { x: x1, y: y1 } = source
    const { x: x2, y: y2 } = target
    g.lineStyle(3, color, 1.0)
    g.lineBetween(x1, y1, x2, y2)
  }

  drawLightning(g: GameObjects.Graphics, source: Point, target: Point) {
    const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
    g.lineStyle(2, color, 1.0)
    const divisions = 7
    const deviation = 7
    const angle = PMath.Angle.BetweenPoints(source, target)
    const alt = (i: number) => Math.random() > 0.5 ? i % 2 === 0 : i % 2 !== 0

    const path = new Curves.Path()
    path.moveTo(source.x, source.y)
    for (let i = 1; i < divisions; i++) {
      const mid = source.lerp(target, i / divisions + (0.1 - Math.random() * 0.2))
      const p = perpendicular(mid, angle, deviation * Math.random(), alt(i))
      path.lineTo(p.x, p.y)
    }
    path.lineTo(target.x, target.y)
    path.draw(g)
  }

  drawPlasma(g: GameObjects.Graphics, source: Point, target: Point) {
    const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
    g.lineStyle(2, color, 1.0)
    const divisions = 7
    const deviation = 7
    const angle = PMath.Angle.BetweenPoints(source, target)
    const alt = (i: number) => Math.random() > 0.5 ? i % 2 === 0 : i % 2 !== 0

    // Collect source, ...midpoints, target (x and y coordinates)
    const xs: number[] = [source.x]
    const ys: number[] = [source.y]
    for (let i = 1; i < divisions; i++) {
      const mid = source.lerp(target, i / divisions)
      const p = perpendicular(mid, angle, deviation * Math.random(), alt(i))
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
