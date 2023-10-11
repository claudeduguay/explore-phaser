import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import TreeLayout, { ILayoutTarget, INodeKey, ITree, IBounds, TreeDirection, TreeAlignment, TreeLineType } from "./TreeLayout";
import { HTMLDrawSurface } from "./HTMLDrawSurface";
import ObservableValue, { useObservableValue } from "../value/ObservableValue";

export function ExampleButton({ title, styling }: { title: string, styling: ObservableValue<CSSProperties> }) {
  const style = useObservableValue<CSSProperties>(styling)
  return <button className="btn btn-primary" style={style}>{title}</button>
}

export class ExampleLayoutTarget extends Map<INodeKey, ObservableValue<CSSProperties>> implements ILayoutTarget {

  isVisible(key: INodeKey): boolean {
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
  layoutTarget: ILayoutTarget
  children: ReactNode
}

export default function ButtonTree({ width, height, tree, layoutTarget, children }: IButtonTreeProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) {
      const drawSurface = new HTMLDrawSurface(ref.current)
      const layout = new TreeLayout(tree, drawSurface, layoutTarget)
      layout.direction = TreeDirection.SOUTH
      layout.alignment = TreeAlignment.CENTER
      layout.lineType = TreeLineType.CURVE
      layout.doLayout()
    }
  }, [ref, tree, layoutTarget, children])
  return <div style={{ width, height, position: "relative" }}>
    <canvas ref={ref} width={width} height={height} className="bg-secondary" style={{
      position: "absolute", top: 0, left: 0, width, height
    }}>
    </canvas>
    {children}
  </div>
}

export function ButtonTreeExample({ width, height }: { width: number, height: number }) {
  const sampleTree: ITree = {
    root: "root",
    edges: new Map<INodeKey, INodeKey[]>()
  }
  sampleTree.edges.set("root", ["left", "right"])
  sampleTree.edges.set("left", ["left-a", "left-b"])
  sampleTree.edges.set("right", ["right-a", "right-b"])
  sampleTree.edges.set("right-a", ["right-a1", "right-a2"])
  const nodeKeySet = [...sampleTree.edges.entries()].reduce((prev, [node, children]) => {
    prev.add(node)
    for (let child of children) {
      prev.add(child)
    }
    return prev
  }, new Set<INodeKey>())
  const layoutTarget = new ExampleLayoutTarget()
  const styles = [...nodeKeySet].map(key => {
    const style = new ObservableValue<CSSProperties>({ position: "absolute", left: 0, top: 0, width: 120, height: 50 })
    layoutTarget.set(key, style)
    return style
  })
  const children = styles.map((style, i) => <ExampleButton key={i} title={`Button ${i + 1}`} styling={style} />)
  return <ButtonTree width={width} height={height} tree={sampleTree} layoutTarget={layoutTarget}>
    {children}
  </ButtonTree>
}
