
import { GameObjects, Scene } from "phaser"
import TDGameScene from "./TDGameScene"
import { sceneSize } from "../../../util/SceneUtil"

export const DEFAULT_FONT_FAMILY = "Geneva, Verdana, sans-serif"

export interface IButtonSpec {
  title: string
  onClick?: () => void
}

export default class TDNavScene extends Scene {

  description!: GameObjects.Text

  constructor(key: string, public readonly main: TDGameScene) {
    super(key)
  }

  addHeader(title: string, top: number = 120, fontSize = 96) {
    const { w } = sceneSize(this)
    this.add.text(w / 2, top, title, {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize,
      align: "center"
    }).setOrigin(0.5)
  }

  addSubtitle(subtitle: string, top: number = 230) {
    const { w } = sceneSize(this)
    this.add.text(w / 2, top, subtitle, {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize: 32,
      align: "center"
    }).setOrigin(0.5)
  }

  addDescription(description: string, top: number = 320) {
    const { w } = sceneSize(this)
    this.description = this.add.text(w / 2, top, description, {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize: 24,
      align: "center",
      lineSpacing: 6
    }).setOrigin(0.5)
  }

  addButtons(buttons: IButtonSpec[], top: number = 420) {
    const { w } = sceneSize(this)
    buttons.forEach(({ title, onClick }, i) => {
      const button = this.add.button(w / 2, top + i * 50, 400, 35, title)
      button.onClick = onClick
    })
  }

}
