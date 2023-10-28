import { GameObjects, Input, Scene, Types } from "phaser";
import { makePlatform } from "../assets/TextureFactory";
import { IPlatformOptions, corners } from "../assets/PlatformFactory";
import { BOX, box } from "../../../util/geom/Box";
import { addLabel } from "../../../util/TextUtil";

function makeKey(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`
}

export default class Button extends GameObjects.Container {

  background: GameObjects.NineSlice
  label?: GameObjects.Text

  constructor(scene: Scene, x: number, y: number, public w: number, public h: number,
    public text?: string, public stylePrefix: string = "blue", public onClick?: (event?: Types.Input.EventData) => void) {
    super(scene, x, y)
    this.background = scene.add.nineslice(0, 0, makeKey(stylePrefix, "button"),
      undefined, w, h, 16, 16, 16, 16)
    this.background.setSize(w, h)
    this.setSize(w, h)// Set bounds
    // this.setDisplaySize(w, h)
    this.add(this.background)
    if (text && text.length > 0) {
      this.label = addLabel(scene, 0, 0, text).setOrigin(0.5)
      this.setLabelColor("white")
      this.add(this.label)
    }

    this.background.setInteractive()
    this.background.on(Input.Events.GAMEOBJECT_POINTER_DOWN, this.onButtonPress)
    this.background.on(Input.Events.GAMEOBJECT_POINTER_OVER, this.onButtonHover)
    this.background.on(Input.Events.GAMEOBJECT_POINTER_UP, this.onButtonNormal)
    this.background.on(Input.Events.GAMEOBJECT_POINTER_OUT, this.onButtonNormal)
  }

  setLabelColor(color: string) {
    if (this.label) {
      this.label.setStyle({ ...this.label.style, color })
    }
  }

  setLabelText(text: string) {
    if (this.label) {
      this.label.setText(text)
    }
  }

  onButtonPress = (pointer: Input.Pointer, x: number, y: number, event: Types.Input.EventData) => {
    this.background.setTexture(makeKey(this.stylePrefix, "button-pressed"))
    this.setLabelColor("#33FF33")
    this.onClick?.(event)
  }

  onButtonHover = () => {
    this.background.setTexture(makeKey(this.stylePrefix, "button-hover"))
  }

  onButtonNormal = () => {
    this.background.setTexture(makeKey(this.stylePrefix, "button"))
    this.setLabelColor("white")
  }
}

export function makeButtonTextures(scene: Scene) {
  const size = { x: 100, y: 100 }
  // Blue buttons
  const blue: Partial<IPlatformOptions> = {
    type: "box",
    margin: box(0),
    inset: box(0.1),
    corners: corners("curve-o"),
    color: ["#666699", "#333366"],
  }
  makePlatform(scene, "blue-button", {
    size,
    options: {
      ...blue,
      colorBox: BOX.TO_SOUTH,
    }
  })
  makePlatform(scene, "blue-button-pressed", {
    size,
    options: {
      ...blue,
      colorBox: BOX.TO_NORTH,
    }
  })
  makePlatform(scene, "blue-button-hover", {
    size,
    options: {
      ...blue,
      colorBox: BOX.TO_SOUTH,
      line: "#FFFFFF",
    }
  })

  const green: Partial<IPlatformOptions> = {
    type: "box",
    margin: box(0),
    inset: box(0.15),
    corners: corners("curve-o"),
    color: ["#669966", "#336633"],
  }
  makePlatform(scene, "green-button", {
    size,
    options: {
      ...green,
      colorBox: BOX.TO_SOUTH,
    }
  })
  makePlatform(scene, "green-button-pressed", {
    size,
    options: {
      ...green,
      colorBox: BOX.TO_NORTH,
    }
  })
  makePlatform(scene, "green-button-hover", {
    size,
    options: {
      ...green,
      colorBox: BOX.TO_SOUTH,
      line: "#FFFFFF",
    }
  })

  // Flat buttons
  const flat: Partial<IPlatformOptions> = {
    type: "box",
    margin: box(0),
    inset: box(0),
  }
  makePlatform(scene, "flat-button", {
    size,
    options: {
      ...flat,
      color: "#666666",
    }
  })
  makePlatform(scene, "flat-button-pressed", {
    size,
    options: {
      ...flat,
      color: "#333333",
    }
  })
  makePlatform(scene, "flat-button-hover", {
    size,
    options: {
      ...flat,
      color: "#999999",
    }
  })
}

export function registerButtonFactory() {
  GameObjects.GameObjectFactory.register("button",
    function (this: GameObjects.GameObjectFactory, x: number, y: number, w: number, h: number,
      text?: string, stylePrefix: string = "blue", onClick?: () => void) {
      const button = new Button(this.scene, x, y, w, h, text, stylePrefix, onClick)
      this.displayList.add(button)
      return button
    }
  )
}
