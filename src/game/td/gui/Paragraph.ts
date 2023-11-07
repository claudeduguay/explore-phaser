import { GameObjects, Scene, Types } from "phaser";

// https://www.w3schools.com/cssref/css_fonts_fallbacks.php
export const DEFAULT_FONT_FAMILY = "Geneva, Verdana, sans-serif"

export const DEFAULT_STYLE: Types.GameObjects.Text.TextStyle = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: 18,
  padding: { x: 4, y: 4 },
  color: "white",
  align: "left",
  // backgroundColor: "rgba(255, 255, 255, 0.25)"
}

export class Paragraph extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, w: number, text: string,
    style: Types.GameObjects.Text.TextStyle = DEFAULT_STYLE) {
    super(scene, x, y, text, { ...style, wordWrap: { width: w } })
    this.setOrigin(0.5, 0)
  }
}

export function registerParagraphFactory() {
  GameObjects.GameObjectFactory.register("paragraph",
    function (this: GameObjects.GameObjectFactory, x: number, y: number, w: number, text: string,
      style?: Types.GameObjects.Text.TextStyle): Paragraph {
      const paragraph = new Paragraph(this.scene, x, y, w, text, style)
      this.displayList.add(paragraph)
      return paragraph
    }
  )
}
