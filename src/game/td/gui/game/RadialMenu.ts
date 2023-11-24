import { GameObjects, Input, Scene, Types, Math as PMath } from "phaser";
import Point from "../../../../util/geom/Point";
import ObservableValue from "../../value/ObservableValue";

export type IPointerListener = (pointer: Input.Pointer, x: number, y: number, event: Types.Input.EventData) => void
export type IPointerHandler<T> = (context: T, pointer: Input.Pointer, x: number, y: number, event: Types.Input.EventData) => void

export function addPointerHandler<T = any>(
  obj: GameObjects.GameObject, event: string, context: T, handler: IPointerHandler<T>) {
  obj.addListener(event, (pointer: Input.Pointer, x: number, y: number, event: Types.Input.EventData) => {
    handler(context, pointer, x, y, event)
  })
}

export function pointOnCircle(a: number, r: number, cx: number = 0, cy: number = 0) {
  a = PMath.Angle.Normalize(a)
  return new Point(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
}

export function radial(scene: Scene, cx: number, cy: number, r: number, items: string[], observable: ObservableValue<string | undefined>) {
  return new RadialMenu(scene, cx, cy, r, items, observable)
}

export class RadialMenu extends GameObjects.Container {

  constructor(scene: Scene, cx: number, cy: number, r: number, items: string[], observable: ObservableValue<string | undefined>) {
    super(scene, cx, cy)
    const span = 15
    const av = (1 / items.length) * Math.PI
    let tl = pointOnCircle(Math.PI / 2 - av, r + span)
    let tr = pointOnCircle(Math.PI / 2 + av, r + span)
    // let bl = pointOnCircle(Math.PI / 2 - av, r - span)
    // let br = pointOnCircle(Math.PI / 2 + av, r - span)
    const t = Math.abs(tl.x - tr.x) / 2
    // const b = Math.abs(bl.x - br.x) / 2
    // const v = Math.abs(tl.y - bl.y) / 2
    items.forEach((item, i) => {
      const a = (i / items.length) * Math.PI * 2
      const pos = pointOnCircle(a, r)
      // if (i > 1) return

      // const points: Point[] = [
      //   new Point(-t, -v),
      //   new Point(t, -v),
      //   new Point(b, v),
      //   new Point(-b, v)
      // ]
      // const hitPoints: Point[] = [
      //   new Point(pos.x - t, pos.y - v),
      //   new Point(pos.x + t, pos.y - v),
      //   new Point(pos.x + b, pos.y + v),
      //   new Point(pos.x - b, pos.y + v)
      // ]
      // const back = scene.add.polygon(pos.x, pos.y, points, 0x666666, 0.75)
      // const hitArea = new Geom.Polygon(hitPoints)
      // back.setInteractive({ hitArea })
      const back = scene.add.rectangle(pos.x, pos.y, t * 2, span * 2, 0x666666, 0.75)
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
        // if (observable.value === item) {
        //   observable.value = undefined
        //   return
        // } else {
        observable.value = item
        const a = text.rotation - Math.PI / 2
        const rotation = -Math.PI / 2 - PMath.Angle.Normalize(a)
        scene.add.tween({
          targets: this,
          rotation,
          duration: 500
        })
        // }
      }

      back.addListener(Input.Events.GAMEOBJECT_POINTER_OVER, onHighlight)
      back.addListener(Input.Events.GAMEOBJECT_POINTER_OUT, onNormal)
      back.addListener(Input.Events.GAMEOBJECT_POINTER_UP, onClick)
      text.addListener(Input.Events.GAMEOBJECT_POINTER_OVER, onHighlight)
      text.addListener(Input.Events.GAMEOBJECT_POINTER_OUT, onNormal)
      text.addListener(Input.Events.GAMEOBJECT_POINTER_UP, onClick)
      this.add(back)

      this.bringToTop(text)
      this.rotation = -Math.PI / 2
    })
  }
}
