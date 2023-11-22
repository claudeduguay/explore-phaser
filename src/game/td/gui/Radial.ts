import { GameObjects, Input, Scene, Types, Math as PMath, Geom } from "phaser";
import Point from "../../../util/geom/Point";

export type IPointerListener<T> = (pointer: Input.Pointer, x: number, y: number, event: Types.Input.EventData) => void
export type IPointerHandler<T> = (context: T, pointer: Input.Pointer, x: number, y: number, event: Types.Input.EventData) => void

export function addPointerHandler<T = any>(
  obj: GameObjects.GameObject, event: string, context: T, handler: IPointerHandler<T>) {
  obj.addListener(event, (pointer: Input.Pointer, x: number, y: number, event: Types.Input.EventData) => {
    handler(context, pointer, x, y, event)
  })
}

export function pointOnEllipse(a: number, rx: number, ry: number, cx: number = 0, cy: number = 0) {
  a = PMath.Angle.Normalize(a)
  return new Point(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry)
}

export function radial(scene: Scene, cx: number, cy: number, rx: number, ry: number, items: string[]) {
  return new RadialMenu(scene, cx, cy, rx, ry, items)
}

export class RadialMenu extends GameObjects.Container {

  constructor(scene: Scene, cx: number, cy: number, rx: number, ry: number, items: string[]) {
    super(scene, cx, cy)
    const span = 15
    const av = (1 / items.length) * Math.PI
    let tl = pointOnEllipse(Math.PI / 2 - av, rx + span, ry + span)
    let tr = pointOnEllipse(Math.PI / 2 + av, rx + span, ry + span)
    let bl = pointOnEllipse(Math.PI / 2 - av, rx - span, ry - span)
    let br = pointOnEllipse(Math.PI / 2 + av, rx - span, ry - span)
    const t = Math.abs(tl.x - tr.x) / 2
    const b = Math.abs(bl.x - br.x) / 2
    const v = Math.abs(tl.y - bl.y) / 2
    console.log("Top:", tl, tr)
    console.log("Bot:", bl, br)
    console.log("T.B.V:", t, b, v)
    items.forEach((item, i) => {
      const a = (i / items.length) * Math.PI * 2
      const pos = pointOnEllipse(a, rx, ry)
      // if (i > 1) return

      const points: Point[] = [
        new Point(-t, -v),
        new Point(t, -v),
        new Point(b, v),
        new Point(-b, v)
      ]
      // const hitPoints: Point[] = [
      //   new Point(pos.x - t, pos.y - v),
      //   new Point(pos.x + t, pos.y - v),
      //   new Point(pos.x + b, pos.y + v),
      //   new Point(pos.x - b, pos.y + v)
      // ]
      const back = scene.add.polygon(pos.x, pos.y, points, 0x666666, 0.75).setOrigin(0)
      // const hitArea = new Geom.Polygon(hitPoints)
      // back.setInteractive({ hitArea })
      // const back = scene.add.rectangle(pos.x, pos.y, 100, 30, 0x666666, 0.75)
      back.setInteractive()
      back.rotation = a + Math.PI / 2

      const text = scene.add.text(pos.x, pos.y, item).setOrigin(0.5)
      text.setInteractive()
      text.rotation = a + Math.PI / 2
      text.setColor("white")
      this.add(text)

      const onHighlight = () => {
        back.setFillStyle(0x6666FF, 0.75)
        text.setColor("orange")
      }
      const onNormal = () => {
        back.setFillStyle(0x666666, 0.75)
        text.setColor("white")
      }
      const onClick = () => {
        const a = text.rotation - Math.PI / 2
        const rotation = -Math.PI / 2 - PMath.Angle.Normalize(a)
        scene.add.tween({
          targets: this,
          rotation,
          duration: 500
        })
      }

      // back.addListener(Input.Events.GAMEOBJECT_POINTER_OVER, onHighlight)
      // back.addListener(Input.Events.GAMEOBJECT_POINTER_OUT, onNormal)
      text.addListener(Input.Events.GAMEOBJECT_POINTER_OVER, onHighlight)
      text.addListener(Input.Events.GAMEOBJECT_POINTER_OUT, onNormal)
      text.addListener(Input.Events.GAMEOBJECT_POINTER_UP, onClick)
      this.add(back)

      this.bringToTop(text)
      this.rotation = -Math.PI / 2
    })
  }
}
