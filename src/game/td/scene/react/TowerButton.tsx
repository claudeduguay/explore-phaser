import ITowerModel from "../../model/ITowerModel";
import useCaptureTower from "./useCaptureTower";
import TDTower from "../../tower/TDTower";

export interface ITowerButtonProps {
  tower: TDTower
  onClick?: (model: ITowerModel | undefined) => void
}

export default function TowerButton({ tower, onClick }: ITowerButtonProps) {
  const imageSrc = useCaptureTower(tower)
  const handleClick = () => {
    if (onClick) {
      onClick(tower.model)
    }
  }
  return <button className="btn rounded p-0 m-0 mx-1" onClick={handleClick} title={tower.model.name}>
    <img src={imageSrc} alt="Tower" width={48} height={48} />
  </button>
}
