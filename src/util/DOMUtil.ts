
import { Scene } from "phaser"
import { ReactNode } from 'react'
import ReactDOM from 'react-dom/client';


export function addReactNode(scene: Scene, node: ReactNode, x: number = 0, y: number = 0) {
  const id = crypto.randomUUID()
  scene.add.dom(x, y).createFromHTML(`<div id="${id}" />`)
  const root = ReactDOM.createRoot(
    document.getElementById(id) as HTMLElement
  )
  root.render(node)
}
