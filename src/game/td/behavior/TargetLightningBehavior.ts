import { Scene, GameObjects, Curves, Math as PMath } from "phaser"
import Point from "../../../util/Point"
import { rotation } from "../../../util/MathUtil"
import BaseTargetBehavior, { ITarget, ITower } from "./BaseTargetBehavior"

function perpendicular({ x, y }: Point, angle: number, r: number, pos: boolean = true) {
  return rotation(x, y, r, r, angle + (pos ? 0 : -Math.PI))
}

export default class TargetLightningBehavior extends BaseTargetBehavior<GameObjects.Graphics> {

  constructor() {
    super(true)
  }

  addEmitter(i: number, { x, y }: ITarget, obj: ITower, time: number): void {
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
    const path = new Curves.Path()
    path.moveTo(source.x, source.y)
    for (let i = 1; i < divisions; i++) {
      const mid = source.lerp(target, i / divisions + (0.1 - Math.random() * 0.2))
      const p = perpendicular(mid, angle, deviation * Math.random(), i % 2 === 0)
      // const back = source.lerp(target, i / divisions + 0.05)
      // path.lineTo(back.x, back.y)
      path.lineTo(p.x, p.y)
    }
    path.lineTo(target.x, target.y)
    path.draw(g)
  }
}

export function testLightiningPath(scene: Scene, source = new Point(50, 760), target = new Point(250, 760)) {
  const g = scene.add.graphics()
  const b = new TargetLightningBehavior()
  b.draw(g, source, target)
}
