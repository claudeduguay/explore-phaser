
import { Scene, Types, Math as PMath } from "phaser"
import { makeEllipse, makeTowerBase, makeTowerGun, makeTowerTurret } from "../util/TextureFactory"
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
    const cx = this.game.canvas.width / 2
    const cy = this.game.canvas.height / 2

    const enemyGroup = this.physics.add.group({ key: "enemyGroup" })
    for (let a = 0; a < 360; a += 90) {
      const enemy = new BaseEnemy(this, cx, cy, a)
      this.add.existing(enemy)
      enemyGroup.add(enemy)
    }

    const towerGroup = this.physics.add.group({ key: "towerGroup" })
    const towers = [
      new TDTower(this, cx - 150, cy, "Tower 1"),
      new TDTower(this, cx, cy, "Tower 2"),
      new TDTower(this, cx + 150, cy, "Tower 3")
    ]

    for (let tower of towers) {
      this.add.existing(tower)
      towerGroup.add(tower)
    }

    this.physics.add.overlap(towerGroup, enemyGroup, this.onOverlap)


    const onHome = () => this.parent.transitionTo("home", "game")
    const onWin = () => this.parent.transitionTo("win", "game")
    const onLose = () => this.parent.transitionTo("lose", "game")

    addReactNode(this,
      <div className="d-flex p-2" style={{ width: 1100, height: 54 }}>
        <div className="flex-fill justify-content-start">
          <div className="row">
            <div className="col-auto">
              <div className="input-group">
                <span className="input-group-text fw-bold">Credits ($)</span>
                <span className="btn btn-success">100</span>
              </div>
            </div>
            <div className="col-auto">
              <div className="input-group">
                <span className="input-group-text fw-bold">Remaining Enemies</span>
                <span className="btn btn-success">25</span>
              </div>
            </div>
            <div className="col-auto">
              <div className="input-group">
                <span className="input-group-text fw-bold">Placeholder</span>
                <span className="btn btn-success">0</span>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-content-end bg-primary">
          <div className="btn-group">
            <button className="btn btn-primary" onClick={onHome}>Home</button>
            <button className="btn btn-primary" onClick={onWin}>Test Win</button>
            <button className="btn btn-primary" onClick={onLose}>Test Lose</button>
          </div>
        </div>
      </div >,
      0, 0)

    addReactNode(this,
      <div className="d-flexjustify-content-center p-2" style={{ width: 1100, height: 54 }}>
        <div className="btn-group">
          <button className="btn btn-primary">Laser</button>
          <button className="btn btn-primary">Bullet</button>
          <button className="btn btn-primary">Missile</button>
        </div>
      </div >,
      0, this.game.canvas.height - 54)
  }

  // Note: Addition order appears to depend on enemyGroup order
  onOverlap(
    towerObj: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemyObj: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    const tower = towerObj as TDTower
    const enemy = enemyObj as BaseEnemy
    const distance = PMath.Distance.BetweenPoints(enemy, tower)
    if (distance <= tower.range) {
      tower.targets.push(enemy as BaseEnemy)
    }
  }

  update(time: number, delta: number): void {
  }
}
