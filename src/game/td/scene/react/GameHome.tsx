import { Scene } from "phaser"
import { sceneSize, transitionTo } from "../../../../util/SceneUtil"
import ClickButton from "./buttons/ClickButton"
import INavigator from "./INavigator"

export interface IGameHomeProps {
  scene: Scene
  navigator: INavigator
}

export default function GameHeader({ scene, navigator }: IGameHomeProps) {
  const { w, h } = sceneSize(navigator)

  const onPlay = () => transitionTo(scene, "play")
  const onLevels = () => transitionTo(scene, "maps")
  const onOptions = () => transitionTo(scene, "options")
  return <div className="d-flex justify-content-center align-items-center" style={{ width: w, height: h, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1 style={{ fontSize: 96 }}>Peep Assault</h1>
        <h4 className="p-3" style={{ width: "60%" }}>
          You are under attack!
        </h4>
        <p className="pb-2" style={{ width: "50%", fontSize: 20 }}>
          Protect yourself from hoards of Peeps on the war path
          by building towers to erradicate the threat before it's too late.</p>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onLevels}>Levels</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onPlay}>Play</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Continue")}>Continue</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={onOptions}>Options</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("About")}>About</ClickButton>
      </div>
      <div className="p-2">
        <ClickButton navigator={navigator} className="btn btn-primary col-4" onClick={() => console.log("Quit")}>Quit</ClickButton>
      </div>
    </div>
  </div>
}
