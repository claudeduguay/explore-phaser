import { CSSProperties } from "react"
import PropsInfo from "./PropsInfo"
import useCaptureTower from "./capture/useCaptureTower"
import TDTower from "../../entity/tower/TDTower"
import CloseButton from "./CloseButton"
import ObservableValue, { useObservableValue } from "../../value/ObservableValue"
import { entitle } from "../../../../util/TextUtil"
import { IUpgrade } from "./PropsTable"
import { Scene } from "phaser"
import { ITowerEffect, effectFormatter } from "../../entity/model/ITowerModel"

export interface ITowerInfoProps {
  scene: Scene
  tower: ObservableValue<TDTower | undefined>
  onClose?: () => void
}

export default function TowerInfo({ scene, tower: towerObservable, onClose }: ITowerInfoProps) {
  const tower = useObservableValue(towerObservable)
  const model = tower?.model
  const imageSrc = useCaptureTower(scene, tower?.model)
  const style: CSSProperties = {
    width: 350,
    backgroundColor: "rgba(64, 64, 64, 0.75)"
  }
  // Prevent auto-closing
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  const upgrade: IUpgrade = {
    level: { text: "+1", cost: 200 },
    cost: { text: "-10%", cost: 100 },
    range: { text: "+10%", cost: 50 },
  }
  const damageFormatter = (damage: ITowerEffect) => effectFormatter("key", damage)
  return <div className="position-reattive text-white bg-overlay border-gold glow -p-3"
    style={style} data-bs-theme="dark" onMouseDown={onMouseDown}>
    <CloseButton onClick={onClose} />
    <h1 className="fs-2 p-1 text-title">Tower Info</h1>
    {model && <>
      <div className="mb-2">
        <img src={imageSrc} alt="Tower" width={64} height={64} />
      </div>
      <h4 className="fs-4 border-top p-1 m-0">{model.name}</h4>
      <p className="mb-2">({entitle(model.group)})</p>
      <p className="text-start py-0 px-3">{model.description}</p>
      <PropsInfo title="General" model={model.general} upgrade={upgrade} />
      <PropsInfo title="Damage (dps per level)" model={model.damage} valueFormatter={damageFormatter} />
    </>}
  </div>
}
