
import { Scene, GameObjects, Types, Physics, Utils, Math as PMath } from "phaser"
import { makeEllipse, makeHeightRects, makePathTiles } from "../assets/TextureFactory"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../tower/TDTower"
import TDGameScene from "./TDGameScene"
import GameHeader from "./react/GameHeader"
import GameFooter from "./react/GameFooter"
import generateMap from "./map/TDLevel"
import Point from "../../../util/Point"
import SelectionManager from "./SelectionManager"
import ITowerModel, { ALL_TOWERS } from "../model/ITowerModel"
import TowerPreview from "../tower/TowerPreview"
import PointCollider, { PointColliders } from "../../../util/PointCollider"
import TowerInfo from "./react/TowerInfo"
import registerTowerTextures from "./TowerTextures"
import ActiveValue from "../value/ActiveValue"
import { shuffle } from "../../../util/ArrayUtil"

export default class TDPlayScene extends Scene {

  activeHealth = new ActiveValue(100, 0, 1000)
  activeCredits = new ActiveValue(0, 0, 1000)
  selectionManager!: SelectionManager
  towerGroup!: Physics.Arcade.Group
  pathPoints!: Point[]
  towerColliders = new PointColliders()
  addingTower?: TDTower

  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "play" })
  }

  preload() {

    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json')
    this.load.image('fire', 'assets/particles/fire_01.png')
    this.load.image('smoke', 'assets/particles/smoke_01.png')
    this.load.image('ice', 'assets/particles/star_08.png')
    this.load.image('muzzle', 'assets/particles/muzzle_01.png')

    makePathTiles(this, "path_tiles", 64, 64)
    makeHeightRects(this, "height_cells", 64, 64, 10)

    registerTowerTextures(this)

    // ENEMY TEXTURES
    makeEllipse(this, "path-green", 20, 20, { color: "#66FF66" })
    makeEllipse(this, "path-blue", 20, 20, { color: "#6666FF" })
    makeEllipse(this, "path-red", 20, 20, { color: "#FF6666" })

    for (let i = 0; i < 8; i++) {
      // First Explosion image size: 583x536, but they are not all the same size
      const key = `explosion0${i}`
      const asset = `assets/explosion/${key}.png`
      this.load.image(key, asset)
      // Sprite has a setTexture(key, [frame]) function
    }
  }

  createExplosionSprite() {
    const frames: { key: string }[] = []
    for (let i = 0; i < 8; i++) {
      frames.push({ key: `explosion0${i}` })
    }
    // shuffle(frames)
    const repeat = -1
    this.anims.create({
      key: "explosion",
      frames,
      frameRate: 8,
      repeat
    })
    const sprite = this.add.sprite(550, 400, "explosion00").setScale(0).play("explosion")
    this.add.tween({
      targets: sprite,
      props: {
        alpha: { value: 0, duration: 1500, repeat },
        scale: { value: 0.4, duration: 1000, repeat }
      },
      ease: "Linear"
    })

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

    // const fireRange = 220
    // this.add.particles(10, 765, 'fire', fireEmitter(fireRange))
    // this.add.rectangle(10, 795, fireRange, 2, 0xFFFFFF).setOrigin(0, 0)
    // this.add.particles(950, 795, 'smoke', cloudEmitter())

    const collectTowerPoints = (adding: TDTower) => {
      const towerPoints: Point[] = []
      this.towerGroup.children.each((grouped: any) => {
        if (grouped instanceof TDTower && grouped !== adding) {
          towerPoints.push(new Point(grouped.x, grouped.y))
        }
        return null
      })
      return towerPoints
    }

    const onAddTower = (model: ITowerModel) => {
      this.addingTower = new TDTower(this, this.input.x, this.input.y, model, this.selectionManager)
      // this.addingTower.showRange.visible = true
      this.selectionManager.select(this.addingTower)
      this.towerGroup.add(this.addingTower)
      this.add.existing(this.addingTower)
      const towerPoints = collectTowerPoints(this.addingTower)
      this.towerColliders.push(new PointCollider(towerPoints))
      this.towerColliders.push(new PointCollider(this.pathPoints))
    }

    let towerInfoDOM: GameObjects.DOMElement
    const onCloseTowerInfo = () => {
      console.log("Close:", towerInfoDOM)
      if (towerInfoDOM) {
        towerInfoDOM.removeElement()
        towerInfoDOM.destroy()
      }
    }
    const onShowTowerInfo = () => {
      towerInfoDOM = addReactNode(this, <TowerInfo tower={this.selectionManager.selected} onClose={onCloseTowerInfo} />, 25, 75)
    }

    addReactNode(this, <GameHeader activeHealth={this.activeHealth} activeCredits={this.activeCredits}
      navigator={this.gameScene} onShowTowerInfo={onShowTowerInfo}
    />, 0, 0)
    addReactNode(this, <GameFooter scene={this} onAddTower={onAddTower} />, 0, this.game.canvas.height - 62)

    const showTowerPreview = false
    if (showTowerPreview) {
      const preview = new TowerPreview(this, 85, 70)
      this.add.existing(preview)
    }

    // testLightiningPath(this)
    this.createExplosionSprite()
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

  checkPointCollision(points: Point[], pos: Point, tolerance: number = 32,) {
    let collision = false
    points?.forEach(point => {
      const diff = point.diff(pos)
      if (diff.x < tolerance && diff.y < tolerance) {
        collision = true
      }
    })
    return collision
  }

  accumulator = 0
  update(time: number, delta: number): void {
    this.accumulator += delta
    if (this.accumulator > 1000) {
      this.activeHealth.adjust(-1)
      this.activeCredits.adjust(2)
      this.accumulator = 0
    }
    if (this.addingTower) {
      if (!this.input.mousePointer.isDown) {
        this.input.setDefaultCursor("none")
        const x = PMath.Snap.Floor(this.input.x, 64) + 32
        const y = PMath.Snap.Floor(this.input.y, 64) + 46 - 32

        // Highlight invalid positions
        if (!this.towerColliders.collision(new Point(x, y))) {
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
      }
    }
  }
}
