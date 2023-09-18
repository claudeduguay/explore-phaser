
import { Scene } from "phaser"
import { makeTowerBase, makeTowerGun, makeTowerTurret } from "../../../util/TextureFactory"
import { addLabel } from "../../../util/TextUtil"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../TDTower" // To register the factory
import TDGame from "../TDGame"

export default class TDPlayScene extends Scene {

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
    const onHome = () => this.parent.transitionTo("home", "game")
    const onWin = () => this.parent.transitionTo("win", "game")
    const onLose = () => this.parent.transitionTo("lose", "game")

    const cx = this.game.canvas.width / 2
    const cy = this.game.canvas.height / 2

    addLabel(this, 10, 10, "This is a sample addLabel output.")

    // this.addTower(new TDTower("tower_1", cx - 150, cy))
    // this.addTower(new TDTower("tower_2", cx, cy))
    // this.addTower(new TDTower("tower_3", cx + 150, cy))

    this.addTower(cx - 150, cy)
    this.addTower(cx, cy)
    this.addTower(cx + 150, cy)

    addReactNode(this,
      <div className="btn-group">
        <button className="btn btn-primary" onClick={onHome}>Home</button>
        <button className="btn btn-primary" onClick={onWin}>Test Win</button>
        <button className="btn btn-primary" onClick={onLose}>Test Lose</button>
      </div>,
      850, 10)
  }

  addTower(x: number, y: number) {
    const tower = new TDTower(this, x, y)
    this.add.existing(tower)
  }

  update(time: number, delta: number): void {
  }
}
