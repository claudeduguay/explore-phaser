import { Scene } from "phaser"
import ITowerModel, { TOWER_LIST } from "../../entity/model/ITowerModel"
import TowerButton from "./TowerButton"
import { canvasSize } from "../../../../util/SceneUtil"

export interface IGameFooterProps {
  scene: Scene
  onAddTower?: (model: ITowerModel) => void
}

export default function GameFooter({ scene, onAddTower }: IGameFooterProps) {
  const { w } = canvasSize(scene)
  const handleAddTower = (model: ITowerModel) => {
    if (onAddTower) {
      onAddTower(model)
    }
  }
  return <div className="d-flex justify-content-center" style={{ width: w, background: "rgba(255, 255, 255, 0.4)" }}>
    <div className="">
      {TOWER_LIST.map((model, i) => {
        return <TowerButton key={i} scene={scene} model={model} onClick={() => handleAddTower(model)} />
      })}
    </div>
  </div>
}
