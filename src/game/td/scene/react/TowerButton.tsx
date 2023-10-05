import ITowerModel from "../../model/ITowerModel";
import useCaptureTower from "./capture/useCaptureTower";
import TDTower from "../../tower/TDTower";
import { Scene } from "phaser";

export interface ITowerButtonProps {
  scene: Scene
  tower: TDTower
  onClick?: (model: ITowerModel | undefined) => void
}

export default function TowerButton({ scene, tower, onClick }: ITowerButtonProps) {
  const imageSrc = useCaptureTower(scene, tower)
  const handleClick = () => {
    if (onClick) {
      onClick(tower.model)
    }
  }
  return <button className="btn rounded p-0 m-0 mx-1" onClick={handleClick} title={tower.model.name}>
    <img src={imageSrc} alt="Tower" width={48} height={48} />
  </button>
}
