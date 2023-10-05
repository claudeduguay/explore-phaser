import { Scene } from "phaser"
import { useEffect, useState } from "react"
import { timeScale } from "../../../../util/TimeUtil"
import IconButton from "./buttons/IconButton"

export interface ISpeedControlProps {
  scene: Scene
}

export default function SpeedControl({ scene }: ISpeedControlProps) {
  const [pause, setPause] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(1)
  useEffect(() => timeScale(scene, pause ? 0 : speed), [scene, pause, speed])
  const togglePause = () => {
    setPause(p => !p)
  }
  const incrementSpeed = () => setSpeed(s => Math.min(s * 2, 4))
  const decrementSpeed = () => setSpeed(s => Math.max(0.25, s / 2))
  const onResetSpeed = () => setSpeed(1)
  const formatSpeed = (s: number) => {
    switch (s) {
      case 0.5:
        return "\u00BDx"
      case 0.25:
        return `\u00BCx`
      default:
        return `${s}x`
    }
  }
  return <div className="input-group">
    <IconButton icon={pause ? "play_arrow" : "pause"} onClick={togglePause} />
    <IconButton icon="navigate_before" onClick={decrementSpeed} />
    <button className="btn btn-primary p-1 pb-2" onClick={onResetSpeed}>{formatSpeed(speed)}</button>
    <IconButton icon="navigate_next" onClick={incrementSpeed} />
  </div>

}
