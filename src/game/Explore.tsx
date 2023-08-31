import { CSSProperties, useEffect, useId } from "react"
import ScanScene from "./ScanScene"
import Phaser from 'phaser'

export interface IExploreProps {
  w?: number
  h?: number
}

export default function Explore({ w = 1100, h = 800 }: IExploreProps) {
  const id = useId()
  useEffect(() => {
    const config: any = {
      type: Phaser.AUTO,
      parent: id,
      width: w,
      height: h,
      scene: ScanScene
    }
    const game = new Phaser.Game(config)
    console.log("Game:", game)
    return () => game.destroy(true)
  }, [w, h, id])
  const style: CSSProperties = {
    width: w,
    height: h
  }
  return <div id={id} style={style}></div>
}
