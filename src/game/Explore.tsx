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
      scene,
      dom: {
        createContainer: true
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }, // No gravity here :v so change it.
          // TO YOU TO ACTUALLY SEE THE ZONE, UNCOMMENT THIS.
          debug: false,
          /*
          debug: true,
          debugShowStaticBody: true,
          debugShowVelocity: true,
          debugVelocityColor: 0xffff00,
          debugBodyColor: 0x0000ff,
          debugStaticBodyColor: 0xffffff
          */
        }
      }
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
