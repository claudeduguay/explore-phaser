import { GameObjects, Input, Scene } from "phaser";
import { makeTowerPlatform } from "../assets/TextureFactory";
import { corners } from "../assets/PlatformFactory";
import { BOX, box } from "../../../util/geom/Box";
import { addLabel } from "../../../util/TextUtil";

export default class Button extends GameObjects.Container {

  background: GameObjects.NineSlice
  label?: GameObjects.Text

  constructor(scene: Scene, x: number, y: number, public w: number, public h: number,
    public text?: string, public onClick?: () => void) {
    super(scene, x, y)
    this.background = scene.add.nineslice(0, 0, "button", undefined, w, h, 16, 16, 16, 16)
    this.background.setSize(w, h)
    this.add(this.background)
    if (text && text.length > 0) {
      this.label = addLabel(scene, 0, 0, text).setOrigin(0.5)
      this.setLabelColor("white")
      this.add(this.label)
    }

    this.background.setInteractive()
    this.background.on(Input.Events.POINTER_DOWN, this.onButtonPress)
    this.background.on(Input.Events.POINTER_UP, this.onButtonNormal)
    this.background.on(Input.Events.POINTER_OUT, this.onButtonNormal)
  }

  setLabelColor(color: string) {
    if (this.label) {
      this.label.setStyle({ ...this.label.style, color })
    }
  }

  onButtonPress = () => {
    this.background.setTexture("button-pressed")
    this.setLabelColor("#33FF33")
    this.onClick?.()
  }

  onButtonNormal = () => {
    this.background.setTexture("button")
    this.setLabelColor("white")
  }
}

export function makeButtonTextures(scene: Scene) {
  const color = ["#0000FF", "#000099"]
  makeTowerPlatform(scene, "button", {
    size: { x: 100, y: 100 },
    options: {
      type: "box",
      corners: corners("curve-o"),
      margin: box(0),
      inset: box(0.15),
      color,
      colorBox: BOX.TO_SOUTH,
    }
  })
  makeTowerPlatform(scene, "button-pressed", {
    size: { x: 100, y: 100 },
    options: {
      type: "box",
      corners: corners("curve-o"),
      margin: box(0),
      inset: box(0.15),
      color,
      colorBox: BOX.TO_NORTH,
    }
  })
}
