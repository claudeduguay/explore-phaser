
import { Scene, Types, Math as PMath, GameObjects } from "phaser"
import { makeEllipse, makeHeightRects, makePathTiles, makeTowerBase, makeTowerGun, makeTowerTurret } from "../assets/TextureFactory"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../tower/TDTower"
import TDGameScene from "./TDGameScene"
import BaseEnemy from "../enemy/BaseEnemy"
import GameHeader from "./react/GameHeader"
import GameFooter from "./react/GameFooter"
import { fireEmitter, cloudEmitter } from "../emitter/EmitterConfig"
import generateMap from "./TDMazeMap"
import Point from "../../../util/Point"

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
    const enemyGroup = this.physics.add.group({ key: "enemyGroup" })

    this.createMap(enemyGroup) // Needs enemy group

    const origin = new Point(6, 50)
    const towerGroup = this.physics.add.group({ key: "towerGroup" })
    const randomCell = () => new Point(
      origin.x + Math.floor(Math.random() * 8) * 64 * 2 + 32 + 64,
      origin.y + Math.floor(Math.random() * 5) * 64 * 2 + 32 + 64)

    const towerCount = 10
    const towers: TDTower[] = []
    const checkDuplicates = new Set<Point>()
    const generateTower = (i: number) => {
      let pos = randomCell()
      while (checkDuplicates.has(pos)) {
        pos = randomCell()
      }
      checkDuplicates.add(pos)
      return new TDTower(this, pos.x, pos.y, `Tower ${i + 1}`)
    }
    for (let i = 0; i < towerCount; i++) {
      towers.push(generateTower(i))
    }

    for (let tower of towers) {
      this.add.existing(tower)
      towerGroup.add(tower)
    }

    this.physics.add.overlap(towerGroup, enemyGroup, this.onOverlap)

    const fireRange = 250
    this.add.particles(100, 765, 'fire', fireEmitter(fireRange))
    this.add.rectangle(100, 795, fireRange, 2, 0xFFFFFF).setOrigin(0, 0)
    this.add.particles(900, 750, 'smoke', cloudEmitter())

    addReactNode(this, <GameHeader navigator={this.gameScene} />, 0, 0)
    addReactNode(this, <GameFooter />, 0, this.game.canvas.height - 54)
  }

  createMap(enemyGroup: GameObjects.Group) {
    generateMap(this, enemyGroup)
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
