
import { Scene, GameObjects } from "phaser"
import { makeTowerBase } from "../../util/TextureFactory"
import { addLabel } from "../../util/TextUtil"
import { addReactNode } from "../../util/DOMUtil"

export default class TDScene extends Scene {

  tower_base!: GameObjects.Image

  preload() {
    makeTowerBase(this, "tower_base", 100, 100)
    console.log("textures:", this.textures)
  }

  create() {
    addLabel(this, 10, 10, "This is a sample addLabel output.")
    this.tower_base = this.add.image(100, 100, "tower_base")
    console.log("tower_base:", this.tower_base)
    addReactNode(this, <button className="btn btn-primary" onClick={() => console.log("Click")}>Test</button>, 50, 200)
  }

  update(time: number, delta: number): void {

  }
}
