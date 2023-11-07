import TDGameScene from "./TDGameScene"
import TDNavScene from "./TDNavScene"
import { transitionTo } from "../../../util/SceneUtil"

// Good example of Fireworks: https://codepen.io/samme/pen/mdpXqNj
// Also: https://codepen.io/satya4satyanm/pen/YzRMXGd
// Discussion Thread: https://phaser.discourse.group/t/fireworks/10579/7

export default class TDHomeScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("win", main)
  }

  create() {
    const onPlay = () => transitionTo(this, "play")
    const onHome = () => transitionTo(this, "home")

    this.addHeader("You Win!")
    this.addSubtitle("Nice work!")
    this.addDescription("You successfully completed this level")

    this.addButtons([
      { title: "Replay", onClick: onPlay },
      { title: "Continue", onClick: onPlay },
      { title: "Home", onClick: onHome }
    ])
  }
}
