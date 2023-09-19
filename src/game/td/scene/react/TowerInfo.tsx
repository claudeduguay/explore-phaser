import { CSSProperties } from "react"
import ITowerModel from "../../model/ITowerModel"
import INavigator from "./INavigator"
import PropsInfo from "./PropsInfo"

export interface ITowerInfoProps {
  navigator: INavigator
  model: ITowerModel
}

export default function TowerInfo({ navigator, model }: ITowerInfoProps) {
  const style: CSSProperties = {
    width: 350,
    // height: 600,
    backgroundColor: "rgba(64, 64, 64, 0.75)"
  }
  const onClose = () => navigator.transitionTo("play", "tower")
  return <div className="text-white bg-overlay border-gold glow -p-3" style={style}>
    <h1 className="fs-2 p-1 text-title">Tower Info</h1>
    <h4 className="fs-4 border-top p-2 m-2">{model.name}</h4>
    <PropsInfo title="General" model={model.stats} />
    <PropsInfo title="Damage (dps per emitter)" model={model.damage} />
    <div className="text-end p-3 pt-0">
      <button className="btn btn-primary" onClick={onClose}>Close</button>
    </div>
  </div>
}
