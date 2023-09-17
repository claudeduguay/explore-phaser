
import { Scene } from "phaser"
import { makeTowerBase, makeTowerGun, makeTowerTurret } from "../../util/TextureFactory"
import { addLabel } from "../../util/TextUtil"
import { addReactNode } from "../../util/DOMUtil"
import TDTower from "./TDTower"

export default class TDScene extends Scene {

  preload() {
    makeTowerBase(this, "tower_base", 64, 64)
    makeTowerTurret(this, "tower_turret", 48, 32)
    makeTowerGun(this, "tower_gun", 8, 32)
    console.log("textures:", this.textures)
  }

  create() {
    const cx = this.game.canvas.width / 2
    const cy = this.game.canvas.height / 2

    addLabel(this, 10, 10, "This is a sample addLabel output.")

    this.scene.add("tower_1", new TDTower("tower_1", cx - 150, cy), true)
    this.scene.add("tower_2", new TDTower("tower_2", cx, cy), true)
    this.scene.add("tower_3", new TDTower("tower_3", cx + 150, cy), true)

    addReactNode(this,
      <button className="btn btn-primary" onClick={() => console.log("Click")}>TestDOM</button>,
      1000, 10)
  }

  update(time: number, delta: number): void {
  }
}
