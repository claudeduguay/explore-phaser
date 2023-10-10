import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import TreeLayout, { INode, ITree } from "./TreeLayout";
import { HTMLDrawSurface } from "./HTMLDrawSurface";

export const TREE = {

}

export function Examplebutton({ title, node }: { title: string, node: INode }) {
  const style: CSSProperties = {
    position: "absolute",
    left: node.position.x,
    top: node.position.y,
    width: node.size.x,
    height: node.size.y
  }
  return <button className="btn btn-primary" style={style}>{title}</button>
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
      const layout = new TreeLayout(tree, drawSurface)
      layout.fullLayout()
    }
  }, [ref, tree, children])
  return <canvas ref={ref} width={width} height={height}>
    {children}
  </canvas>
}

export function ButtonTreeExample({ width, height, tree }: IButtonTreeProps) {
  return <ButtonTree width={width} height={height} tree={tree}>

  </ButtonTree>
}
