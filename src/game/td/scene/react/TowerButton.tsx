import { Scene } from "phaser";
import ITowerModel from "../../model/ITowerModel";
import useCaptureTower from "./useCaptureTower";

export interface ITowerButtonProps {
  scene: Scene
  model: ITowerModel
  onClick?: (model: ITowerModel) => void
}

export default function TowerButton({ scene, model, onClick }: ITowerButtonProps) {
  console.log("Tower:", model)
  const imageSrc = useCaptureTower(scene, model)
  const handleClick = () => {
    if (onClick) {
      onClick(model)
    }
  }
  return <button className="btn btn-primary" onClick={handleClick} style={{ margin: 0, padding: 2 }}>
    <img src={imageSrc} alt="Tower" width={48} height={48} />
  </button>
}
