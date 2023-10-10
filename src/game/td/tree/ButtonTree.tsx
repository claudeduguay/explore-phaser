import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import TreeLayout, { ILayoutTarget, IKey, ITree } from "./TreeLayout";
import { HTMLDrawSurface } from "./HTMLDrawSurface";
import ObservableValue, { useObservableValue } from "../value/ObservableValue";
import Point from "../../../util/Point";

export const TREE = {

}

export function ExampleButton({ title, styling }: { title: string, styling: ObservableValue<CSSProperties> }) {
  const style = useObservableValue<CSSProperties>(styling)
  return <button className="btn btn-primary" style={style}>{title}</button>
}

export class ExampleLayoutTarget extends Map<IKey, ObservableValue<CSSProperties>> implements ILayoutTarget {
  isVisible(key: IKey): boolean | undefined {
    return true
  }
  getSize(key: IKey): Point {
    const observable = this.get(key)
    if (observable) {
      return new Point(observable.value.width as number, observable.value.height as number)
    }
    return new Point()
  }

  getPosition(key: IKey): Point {
    const observable = this.get(key)
    if (observable) {
      return new Point(observable.value.left as number, observable.value.top as number)
    }
    return new Point()
  }

  setBounds(key: IKey, x: number, y: number, w: number, h: number): void {
    const observable = this.get(key)
    if (observable) {
      observable.value = {
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h
      }
    }
  }
}

export interface IButtonTreeProps {
  width: number
  height: number
  tree: ITree
  children: ReactNode
}

export default function ButtonTree({ width, height, tree, children }: IButtonTreeProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) {
      const drawSurface = new HTMLDrawSurface(ref.current)
      const layoutTarget = new ExampleLayoutTarget()
      const layout = new TreeLayout(tree, drawSurface, layoutTarget)
      layout.fullLayout()
    }
  }, [ref, tree, children])
  return <canvas ref={ref} width={width} height={height}>
    {children}
  </canvas>
}

export function ButtonTreeExample({ width, height }: IButtonTreeProps) {
  const tree: ITree = {
    root: "root",
    edges: new Map<IKey, IKey[]>()
  }
  tree.edges.set("root", ["left", "right"])
  tree.edges.set("left", [])
  tree.edges.set("right", [])
  const observables = [...tree.edges.keys()].map(key => new ObservableValue<CSSProperties>({
    position: "absolute", left: 0, top: 0, width: 0, height: 0
  }))
  const children = observables.map((o, i) => <ExampleButton title={`Button ${i + 1}`} styling={o} />)
  return <ButtonTree width={width} height={height} tree={tree}>
    {children}
  </ButtonTree>
}
