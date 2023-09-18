
import { Scene } from "phaser"
import { makeTowerBase, makeTowerGun, makeTowerTurret } from "../../util/TextureFactory"
import { addLabel } from "../../util/TextUtil"
import { addReactNode } from "../../util/DOMUtil"
import TDTower from "./TDTower"
import TDGame from "./TDGame"
import TDHomeScene from "./TDHomeScene"

export default class TDScene extends Scene {

  constructor(public readonly parent: TDGame) {
    super({ key: "play" })
  }

  preload() {
    makeTowerBase(this, "tower_base", 64, 64)
    makeTowerTurret(this, "tower_turret", 48, 32)
    makeTowerGun(this, "tower_gun", 8, 32)
    console.log("textures:", this.textures)
  }

  create() {
    const onHome = () => {
      console.log("Transition to Home")
      this.parent.scene.transition({
        target: "home",
        duration: 1000
      })
    }

    const cx = this.game.canvas.width / 2
    const cy = this.game.canvas.height / 2

    addLabel(this, 10, 10, "This is a sample addLabel output.")

    this.addTower(new TDTower("tower_1", cx - 150, cy))
    this.addTower(new TDTower("tower_2", cx, cy))
    this.addTower(new TDTower("tower_3", cx + 150, cy))

    addReactNode(this,
      <button className="btn btn-primary" onClick={onHome}>Home</button>,
      1020, 10)
  }

  addTower(tower: TDTower) {
    this.scene.add(tower.key, tower, true)
  }

  update(time: number, delta: number): void {
  }
}
