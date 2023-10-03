import { CSSProperties } from "react"
import PropsInfo from "./PropsInfo"
import useCaptureTower from "./useCaptureTower"
import TDTower from "../../tower/TDTower"
import CloseButton from "./CloseButton"
import ObservableValue, { useObservableValue } from "../../value/ObservableValue"

export interface ITowerInfoProps {
  tower: ObservableValue<TDTower | undefined>
  onClose?: () => void
}

export default function TowerInfo({ tower: towerObservable, onClose }: ITowerInfoProps) {
  const tower = useObservableValue(towerObservable)
  const model = tower?.model
  const imageSrc = useCaptureTower(tower)
  const style: CSSProperties = {
    width: 350,
    backgroundColor: "rgba(64, 64, 64, 0.75)"
  }
  return <div className="position-reattive text-white bg-overlay border-gold glow -p-3"
    style={style} data-bs-theme="dark">
    <CloseButton onClick={onClose} />
    <h1 className="fs-2 p-1 text-title">Tower Info</h1>
    {model && <>
      <h4 className="fs-4 border-top p-2 m-2">{model.name}</h4>
      <div><img src={imageSrc} alt="Tower" /></div>
      <PropsInfo title="General" model={model.stats} />
      <PropsInfo title="Damage (dps per level)" model={model.damage} />
    </>}
  </div>
}
