import { Scene } from "phaser"
import { ALL_TOWERS } from "../../model/ITowerModel"
import TowerButton from "./TowerButton"

export interface IGameFooterProps {
  scene: Scene
}

export default function GameFooter({ scene }: IGameFooterProps) {
  ALL_TOWERS.pop()
  const towers = ALL_TOWERS
  return <div className="d-flexjustify-content-center p-2" style={{ width: 1100 }}>
    <div className="btn-group">
      {towers.map((model, i) => <TowerButton key={i} scene={scene} model={model}
        onClick={(m => console.log("Click:", m))} />)}
    </div>
  </div>
}
