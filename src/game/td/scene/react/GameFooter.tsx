import { Scene } from "phaser"
import ITowerModel, { ALL_TOWERS } from "../../model/ITowerModel"
import TowerButton from "./TowerButton"
import TDTower from "../../tower/TDTower"
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
  return <div className="d-flex justify-content-center p-2" style={{ width: w }}>
    <div className="btn-group">
      {ALL_TOWERS.map((model, i) => {
        const tower = new TDTower(scene, 32, 32, model)
        return <TowerButton key={i} tower={tower} onClick={() => handleAddTower(model)} />
      })}
    </div>
  </div>
}
