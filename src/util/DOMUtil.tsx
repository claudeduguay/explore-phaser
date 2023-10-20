
import { GameObjects, Scene, Scenes } from "phaser"
import { ReactNode, useState, useEffect, SetStateAction, Dispatch } from 'react'
import ReactDOM from 'react-dom/client'
import { v4 as uuid } from 'uuid';
import ObservableValue, { CHANGED_EVENT } from "../game/td/value/ObservableValue";

export interface ITweens {
  in?: (onComplete?: () => void) => void
  out?: (onComplete?: () => void) => void
}

export interface IVisibleProps {
  scene: Scene
  gameElement: GameObjects.DOMElement
  tweens?: ITweens
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

export function useShowHideVisible(initVisible: boolean = true, tweens?: ITweens): IShowHideVisible {
  const [visible, setVisible] = useState<boolean>(initVisible)
  // if (initVisible) {
  //   if (tweens?.in) {
  //     tweens.in()
  //   }
  // } else {
  //   if (tweens?.out) {
  //     tweens.out()
  //   }
  // }
  const onShow = () => {
    if (!visible) {
      setVisible(true)
      // if (tweens?.in) {
      //   console.log("Tween in")
      //   tweens.in()
      // }
    }
  }
  const onHide = () => {
    if (visible && tweens?.out) {
      tweens.out(() => {
        console.log("Out complete")
        setVisible(false)
      })
    } else {
      setVisible(false)
    }
  }
  return [onShow, onHide, visible, setVisible]
}

export function useVisible(scene: Scene, initVisible: boolean = true, isVisible?: ObservableValue<boolean>, overlay?: boolean, tweens?: ITweens) {
  const [onShow, onHide, visible] = useShowHideVisible(isVisible ? isVisible.value : initVisible, tweens)
  useEffect(() => {
    if (isVisible) {
      const onChange = (value: boolean) => value ? onShow() : onHide()
      isVisible.addListener(CHANGED_EVENT, onChange)
      return () => {
        isVisible.removeListener(CHANGED_EVENT, onChange)
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
  }, [scene, overlay, onShow, onHide, isVisible])
  return [onShow, onHide, visible, isVisible]
}

export function Visible({ scene, gameElement, tweens, children, visible: initVisible = true, observable, overlay }: IVisibleProps) {
  const [, , visible] = useVisible(scene, initVisible, observable, overlay, tweens)
  useEffect(() => {
    if (visible && tweens?.in) {
      tweens.in(() => {
        console.log("In Complete:", gameElement.x)
      })
    }
  }, [scene, gameElement, tweens, visible])
  return <div>{visible && children}</div>
}

// We'll pass this in from the outside when it works reliably
const slideBuilder = (element: GameObjects.DOMElement, x1: number, y1: number, x2: number, y2: number) => ({
  in: (onComplete?: () => void) => {
    if (element.x !== x2 || element.y !== y2) {
      element.scene.tweens.add({
        targets: element,
        x: x2,
        y: y2,
        ease: 'Linear',
        duration: 500,
        onComplete
      })
    }
  },
  out: (onComplete?: () => void) => {
    if (element.x !== x1 || element.y !== y1) {
      element.scene.tweens.add({
        targets: element,
        x: x1,
        y: y1,
        ease: 'Linear',
        duration: 500,
        onComplete
      })
    }
  }
})

// Tweening-in works, but twening-out has to delay visibility toggle to off
export function addReactNode(scene: Scene, node: ReactNode, x1: number = 0, y1: number = 0, x2: number = x1, y2: number = y1, isVisible?: ObservableValue<boolean>, overlay = false): GameObjects.DOMElement {
  const id = uuid()
  const gameElement = scene.add.dom(x1, y1).createFromHTML(`<div id="${id}" />`)
  const tweens = slideBuilder(gameElement, x1, y1, x2, y2)
  const element = document.getElementById(id) as HTMLElement
  const root = ReactDOM.createRoot(element)
  root.render(<Visible scene={scene} gameElement={gameElement} tweens={tweens} overlay={overlay} observable={isVisible}>{node}</Visible>)
  return gameElement
}
