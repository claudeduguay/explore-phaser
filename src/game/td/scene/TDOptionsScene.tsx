import TDGameScene from "./TDGameScene"
import TDNavScene from "./TDNavScene"
import { transitionTo } from "../../../util/SceneUtil"

export default class TDOptionsScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("options", main)
  }

  create() {

    const onHome = () => transitionTo(this, "home")
    const onMute = () => {
      this.sound.setMute(!this.sound.mute)
      if (this.description) {
        this.description.text = `Muted: ${this.sound.mute}`
      }
    }

    this.addHeader("Game Options")
    this.addSubtitle("You can change settings on this screen.")

    this.addDescription(`Muted: ${this.sound.mute}`)

    this.addButtons([
      { title: "Toggle Mute", onClick: onMute },
      { title: "Home", onClick: onHome },
    ])

  }
}
