import { Scene } from "phaser";
import Button from "./Button";
import { Icon } from "./Icon";

const ICON_STYLE = { color: "white", fontSize: 22, fontStyle: "normal", padding: { x: 2, y: 2 } }

export default class IconButton extends Button {

  icon: Icon

  constructor(scene: Scene, x: number, y: number, public w: number, public h: number,
    icon: string | number, stylePrefix: string = "flat", onClick?: () => void) {
    super(scene, x, y, w, h, "", stylePrefix, onClick)
    this.icon = scene.add.icon(0, 4, icon, ICON_STYLE).setOrigin(0.5)
    this.add(this.icon)
  }

  setIcon(code: string | number) {
    this.icon.setIcon(code)
  }
}
