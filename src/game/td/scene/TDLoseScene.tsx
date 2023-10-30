import TDGameScene from "./TDGameScene"
import TDNavScene from "./TDNavScene"
import { transitionTo } from "../../../util/SceneUtil"

export default class TDLoseScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("lose", main)
  }

  create() {
    const onPlay = () => transitionTo(this, "play")
    const onHome = () => transitionTo(this, "home")

    this.addHeader("You lost!")
    this.addSubtitle("Keep practicing.")
    this.addDescription("You'll do better next time.")

    this.addButtons([
      { title: "Replay", onClick: onPlay },
      { title: "Home", onClick: onHome }
    ])
  }
}
