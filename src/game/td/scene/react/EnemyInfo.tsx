import { CSSProperties } from "react"
import PropsInfo from "./PropsInfo"
import CloseButton from "./CloseButton"
import ObservableValue, { useObservableValue } from "../../value/ObservableValue"
import TDEnemy from "../../enemy/TDEnemy"

export interface IEnemyInfoProps {
  enemy: ObservableValue<TDEnemy | undefined>
  onClose?: () => void
}

export default function EnemyInfo({ enemy: enemyObservable, onClose }: IEnemyInfoProps) {
  const enemy = useObservableValue(enemyObservable)
  const model = enemy?.model
  // const imageSrc = useCaptureEnemy(enemy)

  const style: CSSProperties = {
    width: 350
  }
  const percentFormatter = (value: any) => `${value * 100}%`
  // Prevent auto-closing
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  return <div className="text-white bg-overlay border-gold glow -p-3"
    style={style} data-bs-theme="dark" onMouseDown={onMouseDown}>
    <CloseButton onClick={onClose} />
    <h1 className="fs-2 p-1 text-title">Enemy Info</h1>
    {model && <>
      <h4 className="fs-4 border-top p-1 pt-2">{model.name}</h4>
      <PropsInfo title="General" model={model.stats} />
      <PropsInfo title="Resistance (dps multiplier)" model={model.resistance} valueFormatter={percentFormatter} />
    </>}
  </div>
}
