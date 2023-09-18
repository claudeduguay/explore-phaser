
import { Scene, Scenes } from "phaser"
import { ReactNode, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

export interface IVisibleProps {
  scene: Scene,
  children: ReactNode
  visible?: boolean
}

export function Visible({ scene, children, visible: initVisible = true }: IVisibleProps) {
  const [visible, setVisible] = useState<boolean>(initVisible)
  useEffect(() => {
    scene.events.on(Scenes.Events.TRANSITION_WAKE, () => setVisible(true))
    scene.events.on(Scenes.Events.SLEEP, () => setVisible(false))
  }, [scene])
  return <div>{visible && children}</div>
}

export function addReactNode(scene: Scene, node: ReactNode, x: number = 0, y: number = 0) {
  const id = crypto.randomUUID()
  scene.add.dom(x, y).createFromHTML(`<div id="${id}" />`)
  const element = document.getElementById(id) as HTMLElement
  const root = ReactDOM.createRoot(element)
  root.render(<Visible scene={scene}>{node}</Visible>)
  return element
}
