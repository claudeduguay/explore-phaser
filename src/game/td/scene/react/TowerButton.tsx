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
  return <button className="btn rounded p-0 m-0 mx-1" onClick={handleClick} title={model.name}>
    <img src={imageSrc} alt="Tower" width={48} height={48} />
  </button>
}
