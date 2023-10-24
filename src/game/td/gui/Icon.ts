import { GameObjects, Scene, Types } from "phaser";

export const DEFAULT_STYLE: Types.GameObjects.Text.TextStyle = {
  fontFamily: "Material Icons Outlined",
  padding: { x: 5, top: 5, bottom: 0 },
  color: "white",
  align: "left",
  // backgroundColor: "rgba(255, 255, 255, 0.25)"
}

export class Icon extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, code: string | number,
    style: Types.GameObjects.Text.TextStyle = DEFAULT_STYLE) {
    super(scene, x, y, typeof code === "number" ? String.fromCharCode(code) : code, {
      ...DEFAULT_STYLE,
      ...style
    })
    this.setOrigin(0)
  }
}

export function registerIconFactory() {
  GameObjects.GameObjectFactory.register("icon",
    function (this: GameObjects.GameObjectFactory, x: number, y: number, code: string | number,
      style?: Types.GameObjects.Text.TextStyle): Icon {
      const label = new Icon(this.scene, x, y, code, style)
      this.displayList.add(label)
      return label
    }
  )
}
