import { Scene } from "phaser";
import useCaptureMap from "./capture/useCaptureMap";
import IMapModel from "../map/IMapModel";
import ClickButton from "./buttons/ClickButton";
import INavigator from "./INavigator";

export interface IMapButtonProps {
  scene: Scene
  navigator: INavigator
  model: IMapModel
  title?: string
  onClick?: (model: IMapModel) => void
}

export default function MapButton({ scene, navigator, model, title, onClick }: IMapButtonProps) {
  const imageSrc = useCaptureMap(scene, model)
  const handleClick = () => {
    if (onClick) {
      onClick(model)
    }
  }
  return <ClickButton navigator={navigator} className="btn btn-outline-primary py-1 m-2" onClick={handleClick}>
    {title && <div className="text-white">{title}</div>}
    <img src={imageSrc} alt="Map" />
  </ClickButton>
}
