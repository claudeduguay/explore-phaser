import { Scene, GameObjects, Curves, Math as PMath } from "phaser"
import IBehavior from "./IBehavior"
import Point from "../../../util/Point"
import { lerp, toDegrees } from "../../../util/MathUtil"


export interface IHasPosition {
  x: number
  y: number
}

export interface IHasTargets extends IHasPosition {
  scene: Scene
  targets: IHasPosition[]
}

export default class TargetLaserBehavior implements IBehavior<IHasTargets> {

  g?: GameObjects.Graphics

  update(obj: IHasTargets, time: number, delta: number) {
    if (this.g) {
      this.g.destroy()
    }
    if (obj.targets.length > 0) {
      const target = obj.targets[0]
      const path = computeLightningPath(new Point(obj.x, obj.y), new Point(target.x, target.y))
      this.g = obj.scene.add.graphics({ lineStyle: { color: 0x00FFFF, alpha: 1.0, width: 2 } })
      path.draw(this.g)
    }
  }
}

export function computeLightningPath(source: Point, target: Point, divisions: number = 15, deviation: number = 15) {
  const angle = PMath.Angle.BetweenPoints(target, source) - Math.PI
  console.log("Angle:", toDegrees(angle))
  const distort = () => {
    const dev = lerp(-deviation, deviation, Math.random())
    return new Point(Math.sin(angle) * dev, Math.cos(angle) * dev)
  }
  const path = new Curves.Path()
  path.moveTo(source.x, source.y)
  for (let i = 1; i < divisions; i++) {
    const mid = source.lerp(target, i / divisions).plus(distort())
    path.lineTo(mid.x, mid.y)
  }
  path.lineTo(target.x, target.y)
  return path
}

export function testLightiningPath(scene: Scene) {
  const source = new Point(50, 760)
  const target = new Point(250, 760)

  // Compute perpendicular line
  const angle = PMath.Angle.BetweenPoints(source, target) - Math.PI
  const p1 = new Point(
    Math.sin(angle) * 30 + 150,
    Math.cos(angle) * 30 + 760)
  const p2 = new Point(
    Math.sin(angle - Math.PI) * 30 + 150,
    Math.cos(angle - Math.PI) * 30 + 760)

  const path = computeLightningPath(source, target)
  const g = scene.add.graphics({ lineStyle: { color: 0x00FFFF, alpha: 1.0, width: 1 } })
  path.draw(g)
  g.moveTo(p1.x, p1.y)
  g.lineTo(p2.x, p2.y)
  g.stroke()
}
