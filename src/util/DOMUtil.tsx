
import { GameObjects, Scene, Scenes, Tweens } from "phaser"
import { ReactNode, useState, useEffect, SetStateAction, Dispatch } from 'react'
import ReactDOM from 'react-dom/client'
import { v4 as uuid } from 'uuid';
import ObservableValue, { CHANGED_EVENT } from "../game/td/value/ObservableValue";

export interface ITweens {
  in?: (onComplete?: () => void) => Tweens.Tween
  out?: (onComplete?: () => void) => Tweens.Tween
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
  const onShow = () => {
    setVisible(true)
  }
  const onHide = () => {
    if (tweens?.out) {
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

// Tweening-in works, but twening-out has to delay visibility toggle to off
export function addReactNode(scene: Scene, x: number = 0, y: number = 0, node: ReactNode, isVisible?: ObservableValue<boolean>, overlay = false): GameObjects.DOMElement {
  const id = uuid()
  const tweensBuilder = (element: GameObjects.DOMElement) => ({
    in: (onComplete?: () => void) => scene.tweens.add({
      targets: gameElement,
      x,
      yoyo: false,
      repeat: 0,
      ease: 'Sine.easeInOut',
      duration: 1000,
      onComplete
    }),
    out: (onComplete?: () => void) => scene.tweens.add({
      targets: gameElement,
      x: x - 400,
      yoyo: false,
      repeat: 0,
      ease: 'Sine.easeInOut',
      duration: 2000,
      onComplete
    })
  })
  const gameElement = scene.add.dom(x - 400, y).createFromHTML(`<div id="${id}" />`)
  const tweens = tweensBuilder(gameElement)
  const element = document.getElementById(id) as HTMLElement
  const root = ReactDOM.createRoot(element)
  root.render(<Visible scene={scene} gameElement={gameElement} tweens={tweens} overlay={overlay} observable={isVisible}>{node}</Visible>)
  return gameElement
}
