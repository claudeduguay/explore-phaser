
import { Scene } from "phaser"
import { makeEllipse, makeTowerBase, makeTowerGun, makeTowerTurret } from "../util/TextureFactory"
import { addLabel } from "../../../util/TextUtil"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../tower/TDTower" // To register the factory
import TDGame from "./TDGameScene"
import BaseEnemy from "../enemy/BaseEnemy"

export default class TDPlayScene extends Scene {

  constructor(public readonly parent: TDGame) {
    super({ key: "play" })
  }

  preload() {
    makeTowerBase(this, "tower_base", 64, 64)
    makeTowerTurret(this, "tower_turret", 48, 32)
    makeTowerGun(this, "tower_gun", 7, 32)
    makeEllipse(this, "enemy", 32, 32)
    console.log("textures:", this.textures)
  }

  create() {
    const onHome = () => this.parent.transitionTo("home", "game")
    const onWin = () => this.parent.transitionTo("win", "game")
    const onLose = () => this.parent.transitionTo("lose", "game")

    const cx = this.game.canvas.width / 2
    const cy = this.game.canvas.height / 2

    addLabel(this, 10, 10, "This is a sample addLabel output.")

    const enemies = this.physics.add.group({ key: "enemies" })
    for (let a = 0; a < 360; a += 90) {
      console.log("Add enemy at:", a)
      const enemy = new BaseEnemy(this, cx, cy, a)
      this.add.existing(enemy)
      enemies.add(enemy)
    }
    const tower1 = new TDTower(this, cx - 150, cy)
    tower1.name = "Tower 1"
    const tower2 = new TDTower(this, cx, cy)
    tower2.name = "Tower 2"
    const tower3 = new TDTower(this, cx + 150, cy)
    tower3.name = "Tower 3"
    const towers = [tower1, tower2, tower3]
    const towerZones = this.physics.add.group({ key: "towerZones" })

    for (let tower of towers) {
      this.add.existing(tower)
      towerZones.add(tower)
      this.physics.add.overlap(tower, enemies, tower.onOverlap, undefined, tower)
    }


    addReactNode(this,
      <div className="btn-group">
        <button className="btn btn-primary" onClick={onHome}>Home</button>
        <button className="btn btn-primary" onClick={onWin}>Test Win</button>
        <button className="btn btn-primary" onClick={onLose}>Test Lose</button>
      </div>,
      850, 10)
  }

  update(time: number, delta: number): void {
  }
}
