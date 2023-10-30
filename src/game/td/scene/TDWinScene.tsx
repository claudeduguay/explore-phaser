import TDGameScene from "./TDGameScene"
import TDNavScene from "./TDNavScene"
import { transitionTo } from "../../../util/SceneUtil"

export default class TDHomeScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("win", main)
  }

  create() {
    // addReactNode(this, <GameWin scene={this} navigator={this.main} />, 0, 0)

    const onPlay = () => transitionTo(this, "play")
    const onHome = () => transitionTo(this, "home")

    this.addHeader("You Win!")
    this.addSubtitle("Nice work!")
    this.addDescription("You successfully completed this level.")

    this.addButtons([
      { title: "Replay", onClick: onPlay },
      { title: "Continue", onClick: () => console.log("Continye") },
      { title: "Home", onClick: onHome }
    ])
  }
}
