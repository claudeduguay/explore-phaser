import { GameObjects, Input, Scene } from "phaser";
import { makeTowerPlatform } from "../assets/TextureFactory";
import { IPlatformOptions, corners } from "../assets/PlatformFactory";
import { BOX, box } from "../../../util/geom/Box";
import { addLabel } from "../../../util/TextUtil";

export default class Button extends GameObjects.Container {

  background: GameObjects.NineSlice
  label?: GameObjects.Text

  constructor(scene: Scene, x: number, y: number,
    public width: number, public height: number, // We use width, height to qualify for Size interface
    public text?: string, public onClick?: () => void) {
    super(scene, x, y)
    this.background = scene.add.nineslice(0, 0, "button", undefined, width, height, 16, 16, 16, 16)
    this.background.setSize(width, height)
    this.add(this.background)
    if (text && text.length > 0) {
      this.label = addLabel(scene, 0, 0, text).setOrigin(0.5)
      this.setLabelColor("white")
      this.add(this.label)
    }

    this.background.setInteractive()
    this.background.on(Input.Events.POINTER_DOWN, this.onButtonPress)
    this.background.on(Input.Events.POINTER_OVER, this.onButtonHover)
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

  onButtonHover = () => {
    console.log("On Hover")
    this.background.setTexture("button-hover")
  }

  onButtonNormal = () => {
    this.background.setTexture("button")
    this.setLabelColor("white")
  }
}

export function makeButtonTextures(scene: Scene) {
  const color = ["#0000FF", "#000099"]
  const size = { x: 100, y: 100 }
  const common: Partial<IPlatformOptions> = {
    type: "box",
    margin: box(0),
    inset: box(0.15),
    corners: corners("curve-o"),
    color,
  }
  makeTowerPlatform(scene, "button", {
    size,
    options: {
      ...common,
      colorBox: BOX.TO_SOUTH,
    }
  })
  makeTowerPlatform(scene, "button-pressed", {
    size,
    options: {
      ...common,
      colorBox: BOX.TO_NORTH,
    }
  })
  makeTowerPlatform(scene, "button-hover", {
    size,
    options: {
      ...common,
      colorBox: BOX.TO_SOUTH,
      line: "#FFFFFF"
    }
  })
}

export function registerButtonFactory() {
  GameObjects.GameObjectFactory.register("button",
    function (this: GameObjects.GameObjectFactory, x: number, y: number, w: number, h: number,
      text?: string, onClick?: () => void) {
      const button = new Button(this.scene, x, y, w, h, text, onClick)
      this.displayList.add(button)
      return button
    }
  )
}