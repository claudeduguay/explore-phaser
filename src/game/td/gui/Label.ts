import { GameObjects, Scene, Types } from "phaser";

export const DEFAULT_FONT_FAMILY = "Geneva, Verdana, sans-serif"

export const DEFAULT_STYLE: Types.GameObjects.Text.TextStyle = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: 18,
  padding: { x: 5, y: 5 },
  color: "white",
  align: "left",
  backgroundColor: "rgba(255, 255, 255, 0.25)"
}

export class Label extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string,
    style: Types.GameObjects.Text.TextStyle = DEFAULT_STYLE) {
    super(scene, x, y, text, style)
    this.setOrigin(0)
  }
}

export function registerLabelFactory() {
  GameObjects.GameObjectFactory.register("label",
    function (this: GameObjects.GameObjectFactory, x: number, y: number, text: string,
      style?: Types.GameObjects.Text.TextStyle): Label {
      const label = new Label(this.scene, x, y, text, style)
      this.displayList.add(label)
      return label
    }
  )
}
