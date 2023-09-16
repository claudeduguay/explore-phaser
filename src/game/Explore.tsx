import { CSSProperties, useEffect, useId } from "react"
// import ScanScene from "./ScanScene"
import Phaser, { Scene } from 'phaser'

export interface IExploreProps {
  w?: number
  h?: number
  scene: Scene
}

export default function Explore({ w = 1100, h = 800, scene }: IExploreProps) {
  const id = useId()
  useEffect(() => {
    const config: any = {
      type: Phaser.AUTO,
      parent: id,
      width: w,
      height: h,
      scene
    }
    const game = new Phaser.Game(config)
    return () => {
      game.destroy(true)
    }
  }, [w, h, scene, id])
  const style: CSSProperties = {
    width: w,
    height: h
  }
  return <div id={id} style={style}></div>
}
