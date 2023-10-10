import { ReactNode, useEffect, useRef } from "react";
import TreeLayout, { ITree } from "./TreeLayout";
import { HTMLDrawSurface } from "./HTMLDrawSurface";

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
