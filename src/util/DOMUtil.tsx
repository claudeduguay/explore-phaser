
import { Scene, Scenes } from "phaser"
import { ReactNode, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

export interface IVisibleProps {
  scene: Scene,
  children: ReactNode
  visible?: boolean
  overlay?: boolean
}

export function Visible({ scene, children, visible: initVisible = true, overlay }: IVisibleProps) {
  const [visible, setVisible] = useState<boolean>(initVisible)
  useEffect(() => {
    if (!overlay) {
      const onShow = () => setVisible(true)
      const onHide = () => setVisible(true)
      scene.events.on(Scenes.Events.TRANSITION_WAKE, onShow)
      scene.events.on(Scenes.Events.SLEEP, onHide)
      return () => {
        scene.events.off(Scenes.Events.TRANSITION_WAKE, onShow)
        scene.events.off(Scenes.Events.SLEEP, onHide)
      }
    }
  }, [scene, overlay])
  return <div>{visible && children}</div>
}

export function addReactNode(scene: Scene, node: ReactNode, x: number = 0, y: number = 0, overlay?: false) {
  const id = crypto.randomUUID()
  scene.add.dom(x, y).createFromHTML(`<div id="${id}" />`)
  const element = document.getElementById(id) as HTMLElement
  const root = ReactDOM.createRoot(element)
  root.render(<Visible scene={scene} overlay={overlay}>{node}</Visible>)
  return element
}
