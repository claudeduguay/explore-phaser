
import { Scene, GameObjects, Types, Display, Physics, Utils, Math as PMath } from "phaser"
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
import ITowerModel, { ALL_TOWERS } from "../model/ITowerModel"
import { IColoring } from "../assets/util/DrawUtil"
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
  FIRE: colors(0.00),
  POISON: colors(0.3),
  LAZER: colors(0.6),
  BULLET: colors(0.2),
  MISSILE: colors(0.4),
  LIGHTNING: colors(0.7),
  ICE: colors(0.5),
  BOOST: colors(0.9),
  SLOW: colors(0.8),
}

export default class TDPlayScene extends Scene {

  selectionManager!: SelectionManager
  towerGroup!: Physics.Arcade.Group
  pathPoints!: Point[]
  towerPoints!: Point[]
  addingTower?: TDTower

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
    makeTowerProjector(this, "poison-projector", 7, 22, {
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
    makeTowerProjector(this, "boost-projector", 7, 18, {
      type: "funnel",
      margin: 0,
      inset: 0.8,
      color: COLORS.BOOST,
      balls: { count: 1, color: ["#FCF"], start: 0.7 },
      line: "white"
    })
    makeTowerProjector(this, "slow-projector", 7, 18, {
      type: "rect",
      margin: 0,
      inset: 0.4,
      color: COLORS.SLOW,
      balls: { count: 1, color: ["#FCF"], start: 0 },
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

    const origin = new Point(0, 46)
    this.towerGroup = this.physics.add.group({ key: "towerGroup" })
    this.selectionManager = new SelectionManager(this.towerGroup)

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
      this.towerGroup.add(tower)
    }
    this.selectionManager.select(towers[0])

    this.physics.add.overlap(this.towerGroup, enemyGroup, this.onEnemyOverlap)

    const fireRange = 220
    this.add.particles(10, 765, 'fire', fireEmitter(fireRange))
    this.add.rectangle(10, 795, fireRange, 2, 0xFFFFFF).setOrigin(0, 0)
    this.add.particles(950, 795, 'smoke', cloudEmitter())

    const onAddTower = (model: ITowerModel) => {
      this.addingTower = new TDTower(this, this.input.x, this.input.y, model, this.selectionManager)
      // this.addingTower.showRange.visible = true
      this.selectionManager.select(this.addingTower)
      this.towerGroup.add(this.addingTower)
      this.add.existing(this.addingTower)
      this.towerPoints = []
      this.towerGroup.children.each((grouped: any) => {
        if (grouped instanceof TDTower && grouped !== this.addingTower) {
          this.towerPoints.push(new Point(grouped.x, grouped.y))
        }
        return null
      })
    }

    addReactNode(this, <GameHeader navigator={this.gameScene} />, 0, 0)
    addReactNode(this, <GameFooter scene={this} onAddTower={onAddTower} />, 0, this.game.canvas.height - 62)

    const showTowerPreview = false
    if (showTowerPreview) {
      const preview = new TowerPreview(this, 85, 70)
      this.add.existing(preview)
    }
  }

  createMap(enemyGroup: GameObjects.Group) {
    this.pathPoints = generateMap(this, enemyGroup)
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
  onEnemyOverlap(
    tower: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    if (tower instanceof TDTower && enemy instanceof GameObjects.PathFollower) {
      const distance = PMath.Distance.BetweenPoints(enemy, tower)
      if (distance <= tower.model.stats.range) {
        tower.targets.unshift(enemy)
      }
    }
  }

  pointCollision(points: Point[], pos: Point, tolerance: number = 32,) {
    let collision = false
    points?.forEach(point => {
      const diff = point.diff(pos)
      if (diff.x < tolerance && diff.y < tolerance) {
        collision = true
      }
    })
    return collision
  }

  update(time: number, delta: number): void {
    if (this.addingTower) {
      if (!this.input.mousePointer.isDown) {
        this.input.setDefaultCursor("none")
        let { x, y } = this.input
        x = PMath.Snap.Floor(x, 64) + 32
        y = PMath.Snap.Floor(y, 64) + 46 - 32
        const pos = new Point(x, y)

        let isValid = true
        this.towerPoints?.forEach(point => {
          const diff = point.diff(pos)
          if (diff.x < 32 && diff.y < 32) {
            isValid = false
          }
        })
        if (this.pointCollision(this.towerPoints || [], pos, 32)) {
          isValid = false
        }
        if (this.pointCollision(this.pathPoints || [], pos, 32)) {
          isValid = false
        }

        // Highlight invalid positions
        if (isValid) {
          this.addingTower.tower_base.clearTint()
        } else {
          this.addingTower.tower_base.setTint(0xff0000)
        }
        this.addingTower.setPosition(x, y)
      } else {
        this.input.setDefaultCursor("default")
        if (this.addingTower.tower_base.isTinted) {
          this.addingTower.destroy()
        }
        // this.addingTower.showRange.visible = false
        this.addingTower = undefined
        this.towerPoints = []
      }
    }
  }
}
