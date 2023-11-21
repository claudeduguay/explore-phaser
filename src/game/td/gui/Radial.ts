import { Display, Scene } from "phaser";
import Point from "../../../util/geom/Point";

export function pointOnEllipse(a: number, rx: number, ry: number, cx: number = 0, cy: number = 0) {
  return new Point(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry)
}

export function radial(scene: Scene, cx: number, cy: number, rx: number, ry: number, items: string[]) {

  const container = scene.add.container(cx, cy)
  items.forEach((item, i) => {
    const a = (i / items.length) * Math.PI * 2
    const pos = pointOnEllipse(a, rx, ry)
    const entry = scene.add.container(0, 0)

    const g = scene.add.graphics()
    const av = (1 / items.length) * Math.PI
    const ev = rx / items.length
    // const points: Point[] = []
    // points.push(pointOnEllipse(- av, rx + 20, ry + 20))
    // points.push(pointOnEllipse(+ av, rx + 20, ry + 20))
    // points.push(pointOnEllipse(+ av, rx - 10, ry - 10))
    // points.push(pointOnEllipse(- av, rx - 10, ry - 10))
    const m = scene.add.graphics()
    m.fillStyle(0x000000, 1.0)
    m.fillRect(- 70, ry - 15, 140, 30)
    m.rotation = a + Math.PI / 2
    const mask = m.createGeometryMask()
    // entry.add(m)

    g.slice(0, 0, rx + 20, -av, av)
    g.fillStyle(0x666666, 0.5)
    g.fill()
    // g.setMask(mask)
    // g.fillPoints(points, true)
    // g.generateTexture()
    g.rotation = a + Math.PI / 2

    entry.add(g)

    const text = scene.add.text(pos.x, pos.y, item).setOrigin(0.5)
    text.rotation = a + Math.PI / 2
    entry.add(text)

    container.add(entry)
  })
  // const backgroundCircle = scene.add.circle(0, 0, radius + 35, 0x666666, 0.5)
  // container.add(backgroundCircle)
  // container.sendToBack(backgroundCircle)

  return container
}
