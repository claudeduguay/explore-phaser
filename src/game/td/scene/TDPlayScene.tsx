
import { Scene, GameObjects, Types, Display, Utils, Math as PMath } from "phaser"
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
import { IColoring } from "../assets/util/DrawUtil"
import { addLabel } from "../../../util/TextUtil"
import TowerPreview from "../tower/TowerPreview"

function colors(h: number, s: number = 1, l: number = 0.1) {
  const color = Display.Color.HSLToColor(h, s, l)
  return [
    color.brighten(25).rgba,
    color.rgba,
    color.darken(25).rgba
  ]
}

const COLORS: { [key: string]: IColoring } = {
  FIRE: colors(0.00), // ["#F99", "#F00", "#900"],
  POISON: colors(0.3), // ["#3C3", "#060", "#030"],
  LAZER: colors(0.6), // ["#99F", "#00F", "#009"],
  BULLET: colors(0.2), // ["#CC3", "#660", "#330"],
  MISSILE: colors(0.4), // ["#C93", "#630", "#320"],
  LIGHTNING: colors(0.7), // ["#C3C", "#606", "#303"],
  ICE: colors(0.5), // ["#3CC", "#066", "#033"],
  BOOST: colors(0.9), // ["#843", "#432", "#210"],
  SLOW: colors(0.8), // ["#244", "#122", "#000"],
}

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
      color: COLORS.LAZER
    })
    makePlatform(this, "fire-platform", 64, 64, {
      type: "box-i",
      margin: 0,
      inset: 0.1,
      color: COLORS.FIRE
    })
    makePlatform(this, "poison-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      color: COLORS.POISON
    })
    makePlatform(this, "bullet-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      color: COLORS.BULLET
    })
    makePlatform(this, "missile-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      color: COLORS.MISSILE
    })
    makePlatform(this, "lightning-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      color: COLORS.LIGHTNING
    })
    makePlatform(this, "ice-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      color: COLORS.ICE
    })
    makePlatform(this, "boost-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      color: COLORS.BOOST
    })
    makePlatform(this, "slow-platform", 64, 64, {
      type: "angle",
      margin: 0,
      inset: 0.2,
      color: COLORS.SLOW
    })

    // TURRETS
    makeTowerTurret(this, "lazer-turret", 48, 24, {
      ratio: 0.6,
      topSeg: 3,
      botSeg: 10,
      color: COLORS.LAZER
    })
    makeTowerTurret(this, "fire-turret", 42, 38, {
      ratio: 0.6,
      topSeg: 10,
      botSeg: 10,
      color: COLORS.FIRE
    })
    makeTowerTurret(this, "poison-turret", 38, 38, {
      ratio: 0.5,
      topSeg: 10,
      botSeg: 10,
      color: COLORS.POISON
    })
    makeTowerTurret(this, "bullet-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 4,
      botSeg: 10,
      color: COLORS.BULLET
    })
    makeTowerTurret(this, "missile-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 4,
      botSeg: 10,
      color: COLORS.MISSILE
    })
    makeTowerTurret(this, "lightning-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 10,
      botSeg: 3,
      color: COLORS.LIGHTNING
    })
    makeTowerTurret(this, "ice-turret", 42, 38, {
      ratio: 0.66,
      topSeg: 3,
      botSeg: 10,
      color: COLORS.ICE
    })
    makeTowerTurret(this, "boost-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 10,
      botSeg: 10,
      color: COLORS.BOOST
    })
    makeTowerTurret(this, "slow-turret", 42, 38, {
      ratio: 0.5,
      topSeg: 10,
      botSeg: 10,
      color: COLORS.SLOW
    })

    makeTowerProjector(this, "lazer-projector", 7, 32, {
      type: "rect",
      margin: 0,
      inset: 0.4,
      ribs: { count: 3, color: COLORS.LAZER[1], start: 0.08, step: 0.08 },
      color: COLORS.LAZER,
      line: "white"
    })
    makeTowerProjector(this, "fire-projector", 7, 32, {
      type: "funnel",
      margin: 0,
      inset: 0.33,
      color: COLORS.FIRE,
      line: "white"
    })
    makeTowerProjector(this, "poison-projector", 7, 16, {
      type: "point",
      margin: 0,
      inset: 0.0,
      color: COLORS.POISON,
      line: "white"
    })
    makeTowerProjector(this, "bullet-projector", 7, 38, {
      type: "rect",
      margin: 0,
      inset: 0.35,
      supressor: { pos: 0.15, len: 0.4, color: ["#330", "#990", "#330"] },
      color: COLORS.BULLET,
      line: "white"
    })
    makeTowerProjector(this, "missile-projector", 7, 32, {
      type: "rect",
      margin: 0,
      inset: 0.45,
      color: COLORS.MISSILE,
      line: "white"
    })
    makeTowerProjector(this, "lightning-projector", 7, 32, {
      type: "point",
      margin: 0,
      inset: 0.4,
      balls: { count: 1, color: ["#FCF"], start: 0 },
      color: COLORS.LIGHTNING,
      line: "white"
    })
    makeTowerProjector(this, "ice-projector", 7, 32, {
      type: "funnel",
      margin: 0,
      inset: 0.4,
      color: COLORS.ICE,
      line: "white"
    })
    makeTowerProjector(this, "boost-projector", 7, 16, {
      type: "funnel",
      margin: 0,
      inset: 0.4,
      color: COLORS.BOOST,
      line: "white"
    })
    makeTowerProjector(this, "slow-projector", 7, 16, {
      type: "rect",
      margin: 0,
      inset: 0.4,
      color: COLORS.SLOW,
      line: "white"
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

    const towerCount = 10
    const towers: TDTower[] = []
    const checkDuplicates = new Set<string>()

    const randomCell = () => new Point(
      origin.x + Math.floor(Math.random() * 8) * 64 * 2 + 32 + 64,
      origin.y + Math.floor(Math.random() * 5) * 64 * 2 + 32 + 64)
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

    const fireRange = 220
    this.add.particles(10, 765, 'fire', fireEmitter(fireRange))
    this.add.rectangle(10, 795, fireRange, 2, 0xFFFFFF).setOrigin(0, 0)
    this.add.particles(950, 795, 'smoke', cloudEmitter())

    addReactNode(this, <GameHeader navigator={this.gameScene} />, 0, 0)
    addReactNode(this, <GameFooter scene={this} />, 0, this.game.canvas.height - 62)

    const preview = new TowerPreview(this, 85, 70)
    this.add.existing(preview)

  }

  createMap(enemyGroup: GameObjects.Group) {
    generateMap(this, enemyGroup)
    const showSpriteSheet = false
    if (showSpriteSheet) {
      const g = this.add.graphics()
      const margin = 10
      const x = 38
      g.fillStyle(0xCCCCFF, 1)
      g.fillRect(x - margin, 650 - margin, 16 * 64 + margin * 2, 64 + margin * 2)
      this.add.sprite(x, 650, "path_tiles").setOrigin(0, 0)
    }
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
