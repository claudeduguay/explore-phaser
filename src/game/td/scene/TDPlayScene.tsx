
import { Scene, GameObjects, Types, Utils, Math as PMath } from "phaser"
import { makeEllipse, makeHeightRects, makePathTiles, makePlatform, makeTowerProjector, makeTowerTurret } from "../assets/TextureFactory"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../tower/TDTower"
import TDGameScene from "./TDGameScene"
import GameHeader from "./react/GameHeader"
import GameFooter from "./react/GameFooter"
import { fireEmitter, cloudEmitter } from "../emitter/ParticleConfig"
import generateMap from "./TDMazeMap"
import Point from "../../../util/Point"
import SelectionManager from "./SelectionManager"
import { ALL_TOWERS } from "../model/ITowerModel"
import { addLabel } from "../../../util/TextUtil"

export default class TDPlayScene extends Scene {

  selectionManager!: SelectionManager

  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "play" })
  }

  preload() {

    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json')
    this.load.image('fire', 'assets/particles/fire_01.png')
    this.load.image('smoke', 'assets/particles/smoke_01.png')
    makePathTiles(this, "path_tiles", 64, 64)
    makeHeightRects(this, "height_cells", 64, 64, 10)

    // PLATFORMS
    makePlatform(this, "lazer-platform", 64, 64, {
      type: "curve-o",
      margin: 0,
      inset: 0.2,
      gradient: ["#99F", "#00F", "#009"]
    })
    makePlatform(this, "fire-platform", 64, 64, {
      type: "box-i",
      margin: 0,
      inset: 0.1,
      gradient: ["#F99", "#F00", "#900"]
    })
    makePlatform(this, "poison-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      gradient: ["#3C3", "#060", "#030"]
    })
    makePlatform(this, "bullet-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      gradient: ["#CC3", "#660", "#330"]
    })
    makePlatform(this, "missile-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      gradient: ["#3CC", "#066", "#033"]
    })
    makePlatform(this, "lightning-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      gradient: ["#C3C", "#606", "#303"]
    })
    makePlatform(this, "ice-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      gradient: ["#C3C", "#606", "#303"]
    })
    makePlatform(this, "boost-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      gradient: ["#C3C", "#606", "#303"]
    })

    // TURRETS
    makeTowerTurret(this, "lazer-turret", 48, 24, {
      ratio: 0.6,
      topSeg: 3,
      botSeg: 10,
      gradient: ["#33F", "#009", "#003"]
    })
    makeTowerTurret(this, "fire-turret", 42, 38, {
      ratio: 0.6,
      topSeg: 10,
      botSeg: 10,
      gradient: ["#933", "#900", "#300"]
    })
    makeTowerTurret(this, "poison-turret", 38, 38, {
      ratio: 0.5,
      topSeg: 10,
      botSeg: 10,
      gradient: ["#393", "#090", "#030"]
    })
    makeTowerTurret(this, "bullet-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 4,
      botSeg: 10,
      gradient: ["#CC3", "#660", "#330"]
    })
    makeTowerTurret(this, "missile-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 4,
      botSeg: 10,
      gradient: ["#3CC", "#066", "#033"]
    })
    makeTowerTurret(this, "lightning-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 4,
      botSeg: 10,
      gradient: ["#C3C", "#606", "#303"]
    })
    makeTowerTurret(this, "ice-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 4,
      botSeg: 10,
      gradient: ["#C3C", "#606", "#303"]
    })
    makeTowerTurret(this, "boost-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 4,
      botSeg: 10,
      gradient: ["#C3C", "#606", "#303"]
    })

    makeTowerProjector(this, "lazer-projector", 7, 32, {
      type: "rect",
      margin: 0,
      inset: 0.35,
      ribs: { count: 3, color: ["#CCF"], start: 0.08, step: 0.08 },
      gradient: ["#66C", "#009"]
    })
    makeTowerProjector(this, "fire-projector", 7, 32, {
      type: "funnel",
      margin: 0,
      inset: 0.33,
      gradient: ["#E00", "#FCC", "#E00"]
    })
    makeTowerProjector(this, "poison-projector", 7, 16, {
      type: "point",
      margin: 0,
      inset: 0.0,
      gradient: ["#090"],
      line: "white"
    })
    makeTowerProjector(this, "bullet-projector", 7, 38, {
      type: "rect",
      margin: 0,
      inset: 0.35,
      supressor: { pos: 0.15, len: 0.4, color: ["#330", "#990", "#330"] },
      gradient: ["#330", "#990", "#330"],
      // line: "#FFF"
    })
    makeTowerProjector(this, "missile-projector", 7, 32, {
      type: "rect",
      margin: 0,
      inset: 0.45,
      gradient: ["#066"],
      line: "#FFF"
    })
    makeTowerProjector(this, "lightning-projector", 7, 32, {
      type: "point",
      margin: 0,
      inset: 0.4,
      balls: { count: 1, color: ["#FCF"], start: 0.1 },
      gradient: ["#FCF", "#FCF", "#E0E"]
    })
    makeTowerProjector(this, "ice-projector", 7, 32, {
      type: "point",
      margin: 0,
      inset: 0.4,
      balls: { count: 1, color: ["#FCF"], start: 0.1 },
      gradient: ["#FCF", "#FCF", "#E0E"]
    })
    makeTowerProjector(this, "boost-projector", 7, 32, {
      type: "point",
      margin: 0,
      inset: 0.4,
      balls: { count: 1, color: ["#FCF"], start: 0.1 },
      gradient: ["#FCF", "#FCF", "#E0E"]
    })

    // ENEMIES
    makeEllipse(this, "path-green", 20, 20, "#66FF66")
    makeEllipse(this, "path-blue", 20, 20, "#6666FF")
    makeEllipse(this, "path-red", 20, 20, "#FF6666")
  }

  create() {
    const enemyGroup = this.physics.add.group({ key: "enemyGroup" })

    this.createMap(enemyGroup) // Needs enemy group

    const origin = new Point(6, 50)
    const towerGroup = this.physics.add.group({ key: "towerGroup" })
    this.selectionManager = new SelectionManager(towerGroup)
    const randomCell = () => new Point(
      origin.x + Math.floor(Math.random() * 8) * 64 * 2 + 32 + 64,
      origin.y + Math.floor(Math.random() * 5) * 64 * 2 + 32 + 64)

    const towerCount = 10
    const towers: TDTower[] = []
    const checkDuplicates = new Set<string>()
    ALL_TOWERS.forEach((model, i) => {
      const p = new Point(50 + i * 100, 100)
      const t = new TDTower(this, p.x, p.y, model)
      this.add.existing(t)
      addLabel(this, p.x - 32, p.y + 32, model.name.split(" ")[0])

    })
    const generateTower = (i: number) => {
      let pos = randomCell()
      while (checkDuplicates.has(pos.toString())) {
        pos = randomCell()
      }
      checkDuplicates.add(pos.toString())
      const model = Utils.Array.GetRandom(ALL_TOWERS)
      return new TDTower(this, pos.x, pos.y, model, this.selectionManager)
    }
    for (let i = 0; i < towerCount; i++) {
      const tower = generateTower(i)
      towers.push(tower)
      this.add.existing(tower)
      towerGroup.add(tower)
    }
    this.selectionManager.select(towers[0])

    this.physics.add.overlap(towerGroup, enemyGroup, this.onOverlap)

    const fireRange = 250
    this.add.particles(100, 765, 'fire', fireEmitter(fireRange))
    this.add.rectangle(100, 795, fireRange, 2, 0xFFFFFF).setOrigin(0, 0)
    this.add.particles(900, 750, 'smoke', cloudEmitter())

    addReactNode(this, <GameHeader navigator={this.gameScene} />, 0, 0)
    addReactNode(this, <GameFooter scene={this} />, 0, this.game.canvas.height - 64)
  }

  createMap(enemyGroup: GameObjects.Group) {
    generateMap(this, enemyGroup)
    // this.add.sprite(50, 650, "path_tiles").setOrigin(0, 0)
  }

  // Note: Addition order appears to depend on enemyGroup order
  onOverlap(
    tower: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    if (tower instanceof TDTower && enemy instanceof GameObjects.PathFollower) {
      const distance = PMath.Distance.BetweenPoints(enemy, tower)
      if (distance <= tower.model.stats.range) {
        tower.targets.unshift(enemy)
      }
    }
  }

  update(time: number, delta: number): void {
  }
}
