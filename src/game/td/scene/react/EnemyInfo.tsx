import { CSSProperties } from "react"
import IEnemyModel from "../../model/IEnemyModel"
import INavigator from "./INavigator"
import PropsInfo from "./PropsInfo"
import CloseButton from "./CloseButton"

export interface IEnemyInfoProps {
  navigator: INavigator
  model: IEnemyModel
}

export default function EnemyInfo({ navigator, model }: IEnemyInfoProps) {
  const style: CSSProperties = {
    width: 350
  }
  const percentFormatter = (value: any) => `${value * 100}%`
  const onClose = () => navigator.transitionTo("play", "enemy")
  return <div className="text-white bg-overlay border-gold glow -p-3"
    style={style} data-bs-theme="dark">
    <CloseButton onClick={onClose} />
    <h1 className="fs-2 p-1 text-title">Enemy Info</h1>
    <h4 className="fs-4 border-top p-1 pt-2">{model.name}</h4>
    <PropsInfo title="General" model={model.stats} />
    <PropsInfo title="Damage (dps multiplier)" model={model.damage} valueFormatter={percentFormatter} />
  </div>
}
