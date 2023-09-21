
import { Scene, Types, Math as PMath } from "phaser"
import { makeEllipse, makeHeightRects, makePathTiles, makeTowerBase, makeTowerGun, makeTowerTurret } from "../assets/TextureFactory"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../tower/TDTower"
import TDGameScene from "./TDGameScene"
import BaseEnemy from "../enemy/BaseEnemy"
import GameHeader from "./react/GameHeader"
import GameFooter from "./react/GameFooter"
import { fireEmitter, cloudEmitter } from "../emitter/EmitterConfig"
import generateMap from "./TDMazeMap"

export default class TDPlayScene extends Scene {

  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "play" })
  }

  preload() {

    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json')
    this.load.image('fire', 'assets/particles/fire_01.png')
    this.load.image('smoke', 'assets/particles/smoke_01.png')
    makePathTiles(this, "path_tiles", 64, 64)
    makeHeightRects(this, "height_cells", 64, 64, 10)
    makeTowerBase(this, "tower_base", 64, 64)
    makeTowerTurret(this, "tower_turret", 48, 32)
    makeTowerGun(this, "tower_gun", 7, 32)
    makeEllipse(this, "enemy", 32, 32)
    makeEllipse(this, "path", 20, 20, "#3333FF")
    console.log("textures:", this.textures)
  }

  create() {
    this.createMap()

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

    const fireRange = 250
    this.add.particles(100, 175, 'fire', fireEmitter(fireRange))
    this.add.rectangle(100, 210, fireRange, 2, 0xFFFFFF).setOrigin(0, 0)
    this.add.particles(900, 200, 'smoke', cloudEmitter())

    addReactNode(this, <GameHeader navigator={this.gameScene} />, 0, 0)
    addReactNode(this, <GameFooter />, 0, this.game.canvas.height - 54)
  }

  createMap() {
    generateMap(this)
    // this.add.sprite(50, 650, "path_tiles").setOrigin(0, 0)
    // const map = new TDMap(this)
    // this.add.existing(map)
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
