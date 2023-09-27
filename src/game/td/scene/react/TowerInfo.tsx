import { CSSProperties } from "react"
import PropsInfo from "./PropsInfo"
import useCaptureTower from "./useCaptureTower"
import TDTower from "../../tower/TDTower"

export interface ITowerInfoProps {
  tower: TDTower
  onClose?: () => void
}

export default function TowerInfo({ tower, onClose }: ITowerInfoProps) {
  const model = tower.model
  const imageSrc = useCaptureTower(tower.scene, tower.model)
  const style: CSSProperties = {
    width: 350,
    backgroundColor: "rgba(64, 64, 64, 0.75)"
  }
  // const onClose = () => navigator.transitionTo("play", "tower")
  return <div className="text-white bg-overlay border-gold glow -p-3" style={style}>
    <h1 className="fs-2 p-1 text-title">Tower Info</h1>
    <h4 className="fs-4 border-top p-2 m-2">{model.name}</h4>
    <div><img src={imageSrc} alt="Tower" /></div>
    <PropsInfo title="General" model={model.stats} />
    <PropsInfo title="Damage (dps per emitter)" model={model.damage} />
    <div className="text-end p-3 pt-0">
      <button className="btn btn-primary" onClick={onClose}>Close</button>
    </div>
  </div>
}
