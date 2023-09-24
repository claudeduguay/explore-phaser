import { Scene } from "phaser"
import { ALL_TOWERS } from "../../model/ITowerModel"
import TowerButton from "./TowerButton"

export interface IGameFooterProps {
  scene: Scene
}

export default function GameFooter({ scene }: IGameFooterProps) {
  return <div className="d-flex justify-content-center p-2" style={{ width: 1100 }}>
    <div className="btn-group">
      {ALL_TOWERS.map((model, i) => <TowerButton key={i} scene={scene} model={model}
        onClick={(m => console.log("Click:", m))} />)}
    </div>
  </div>
}
