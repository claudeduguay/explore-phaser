
import TDGameScene from "./TDGameScene"
import TDNavScene from "./TDNavScene"
import { transitionTo } from "../../../util/SceneUtil"

export default class TDAboutScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("about", main)
  }

  create() {
    const onHome = () => transitionTo(this, "home")

    this.addHeader("Peep Assault")
    this.addSubtitle("Created by Claude Duguay")
    this.addDescription(`This is a Tower Defense game with a wide variety of towers.
It was developed using the Phaser 3 framework 
and a very large number of invested hours.`)

    this.addButtons([
      { title: "Home", onClick: onHome }
    ], 440)
  }
}
