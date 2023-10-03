
import { GameObjects, Scene, Scenes } from "phaser"
import { ReactNode, useState, useEffect, SetStateAction, Dispatch } from 'react'
import ReactDOM from 'react-dom/client'
import { v4 as uuid } from 'uuid';
import ObservableValue, { CHANGED_EVENT } from "../game/td/value/ObservableValue";

export interface IVisibleProps {
  scene: Scene,
  children: ReactNode
  visible?: boolean
  observable?: ObservableValue<boolean>
  context?: ObservableValue<any> // Not used yet
  overlay?: boolean
}

export type OnShow = () => void
export type OnHide = () => void

export type IShowHideVisible = [
  onShow: OnShow,
  onHide: OnHide,
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>
]

export function useShowHideVisible(initVisible: boolean = true): IShowHideVisible {
  const [visible, setVisible] = useState<boolean>(initVisible)
  const onShow = () => setVisible(true)
  const onHide = () => setVisible(false)
  return [onShow, onHide, visible, setVisible]
}

export function useVisible(scene: Scene, initVisible: boolean = true, observable?: ObservableValue<boolean>, overlay?: boolean) {
  const [onShow, onHide, visible] = useShowHideVisible(observable ? observable.value : initVisible)
  useEffect(() => {
    if (observable) {
      const onChange = (value: boolean) => value ? onShow() : onHide()
      observable.addListener(CHANGED_EVENT, onChange)
      return () => {
        observable.removeListener(CHANGED_EVENT, onChange)
      }
    }
    if (!overlay) {
      scene.events.on(Scenes.Events.TRANSITION_WAKE, onShow)
      scene.events.on(Scenes.Events.SLEEP, onHide)
      return () => {
        scene.events.off(Scenes.Events.TRANSITION_WAKE, onShow)
        scene.events.off(Scenes.Events.SLEEP, onHide)
      }
    }
  }, [scene, overlay, onShow, onHide, observable])
  return [onShow, onHide, visible, observable]
}

export function Visible({ scene, children, visible: initVisible = true, observable, overlay }: IVisibleProps) {
  const [, , visible] = useVisible(scene, initVisible, observable, overlay)
  return <div>{visible && children}</div>
}

export function addReactNode(scene: Scene, x: number = 0, y: number = 0, node: ReactNode, isVisible?: ObservableValue<boolean>, overlay = false): GameObjects.DOMElement {
  const id = uuid()
  const gameDOM = scene.add.dom(x, y).createFromHTML(`<div id="${id}" />`)
  const element = document.getElementById(id) as HTMLElement
  const root = ReactDOM.createRoot(element)
  root.render(<Visible scene={scene} overlay={overlay} observable={isVisible}>{node}</Visible>)
  return gameDOM
}
