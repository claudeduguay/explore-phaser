import { Scene } from "phaser";
import useCaptureMap from "./capture/useCaptureLevel";
import ClickButton from "./buttons/ClickButton";
import INavigator from "./INavigator";
import { ILevelModel } from "./GameLevels";

export interface IMapButtonProps {
  scene: Scene
  navigator: INavigator
  model: ILevelModel
  title?: string
  onClick?: (model: ILevelModel) => void
}

export default function LevelButton({ scene, navigator, model, title, onClick }: IMapButtonProps) {
  const imageSrc = useCaptureMap(scene, model)
  const handleClick = () => {
    if (onClick) {
      onClick(model)
    }
  }
  return <ClickButton navigator={navigator} className="btn btn-outline-primary py-1 m-2" onClick={handleClick}>
    {title && <div className="text-white pb-1">{title}</div>}
    <img src={imageSrc} alt="Map" />
  </ClickButton>
}
