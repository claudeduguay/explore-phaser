
import TDGameScene from "./TDGameScene"
import TDNavScene from "./TDNavScene"
import { transitionTo } from "../../../util/SceneUtil"

export default class TDHomeScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("home", main)
  }

  create() {
    const onPlay = () => transitionTo(this, "play")
    const onLevels = () => transitionTo(this, "maps")
    const onOptions = () => transitionTo(this, "options")

    this.addHeader("Peep Assault")
    this.addSubtitle("You are under attack!")
    this.addDescription(`Protect yourself from hoards of Peeps on the war path
by building towers to erradicate the threat before it's too late.`)

    this.addButtons([
      { title: "Levels", onClick: onLevels },
      { title: "Play", onClick: onPlay },
      { title: "Continue", onClick: () => console.log("Continue") },
      { title: "Options", onClick: onOptions },
      { title: "About", onClick: () => console.log("About") },
      { title: "Quit", onClick: () => console.log("Quit") },
    ], 400)
  }
}
