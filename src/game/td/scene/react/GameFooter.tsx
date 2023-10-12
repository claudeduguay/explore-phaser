import { Scene } from "phaser"
import ITowerModel, { TOWER_LIST } from "../../entity/model/ITowerModel"
import TowerButton from "./TowerButton"
import TDTower from "../../entity/tower/TDTower"
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
      {TOWER_LIST.map((model, i) => {
        const tower = new TDTower(scene, 32, 32, model)
        return <TowerButton key={i} scene={scene} tower={tower} onClick={() => handleAddTower(model)} />
      })}
    </div>
  </div>
}
