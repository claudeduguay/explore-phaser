import ITowerModel from "../../entity/model/ITowerModel";
import useCaptureTower from "./capture/useCaptureTower";
import { Scene } from "phaser";

export interface ITowerButtonProps {
  scene: Scene
  model: ITowerModel
  onClick?: (model: ITowerModel | undefined) => void
}

export default function TowerButton({ scene, model, onClick }: ITowerButtonProps) {
  const imageSrc = useCaptureTower(scene, model)
  const handleClick = () => {
    if (onClick) {
      onClick(model)
    }
  }
  return <button className="btn p-1 m-0" onClick={handleClick} title={model.name}>
    <img src={imageSrc} alt="Tower" width={48} height={48} />
  </button>
}
