import { Scene } from "phaser";
import ITowerModel from "../../model/ITowerModel";
import useCaptureTower from "./useCaptureTower";

export interface ITowerButtonProps {
  scene: Scene
  model: ITowerModel
  onClick?: (model: ITowerModel) => void
}

export default function TowerButton({ scene, model, onClick }: ITowerButtonProps) {
  const imageSrc = useCaptureTower(scene, model)
  const handleClick = () => {
    if (onClick) {
      onClick(model)
    }
  }
  return <button className="btn rounded" onClick={handleClick} style={{ padding: 3, margin: 2 }} title={model.name}>
    <img src={imageSrc} alt="Tower" width={48} height={48} />
  </button>
}
