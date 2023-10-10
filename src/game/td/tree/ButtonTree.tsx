import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import TreeLayout, { ILayoutTarget, INodeKey, ITree, IBounds } from "./TreeLayout";
import { HTMLDrawSurface } from "./HTMLDrawSurface";
import ObservableValue, { useObservableValue } from "../value/ObservableValue";

export function ExampleButton({ title, styling }: { title: string, styling: ObservableValue<CSSProperties> }) {
  const style = useObservableValue<CSSProperties>(styling)
  return <button className="btn btn-primary" style={style}>{title}</button>
}

export class ExampleLayoutTarget extends Map<INodeKey, ObservableValue<CSSProperties>> implements ILayoutTarget {

  isVisible(key: INodeKey): boolean | undefined {
    return true
  }

  getBounds(key: INodeKey): IBounds {
    const observable = this.get(key)
    if (observable) {
      return {
        x: observable.value.left as number,
        y: observable.value.top as number,
        w: observable.value.width as number,
        h: observable.value.height as number
      }
    }
    return { x: 0, y: 0, w: 0, h: 0 }
  }

  setBounds(key: INodeKey, bounds: IBounds): void {
    const observable = this.get(key)
    if (observable) {
      observable.value = {
        position: "absolute",
        left: bounds.x,
        top: bounds.y,
        width: bounds.w,
        height: bounds.h
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
  const sampleTree: ITree = {
    root: "root",
    edges: new Map<INodeKey, INodeKey[]>()
  }
  sampleTree.edges.set("root", ["left", "right"])
  sampleTree.edges.set("left", [])
  sampleTree.edges.set("right", [])
  const observables = [...sampleTree.edges.keys()].map(key => new ObservableValue<CSSProperties>({
    position: "absolute", left: 0, top: 0, width: 0, height: 0
  }))
  const children = observables.map((o, i) => <ExampleButton title={`Button ${i + 1}`} styling={o} />)
  return <ButtonTree width={width} height={height} tree={sampleTree}>
    {children}
  </ButtonTree>
}
