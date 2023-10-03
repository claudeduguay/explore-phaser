
import { Scene, GameObjects, Types, Physics, Utils, Math as PMath, Input } from "phaser"
import { makeEllipse, makeHeightRects } from "../assets/TextureFactory"
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
import { testPlasmaPath } from "../behavior/TargetPlasmaBehavior"
import ObservableValue from "../value/ObservableValue"
import { canvasSize } from "../../../util/SceneUtil"

export interface IActiveValues {
  health: ActiveValue,
  credits: ActiveValue
}

export default class TDPlayScene extends Scene {

  active: IActiveValues = {
    health: new ActiveValue(100, 0, 1000),
    credits: new ActiveValue(0, 0, 1000)
  }
  towerSelectionManager!: SelectionManager
  towerGroup!: Physics.Arcade.Group
  pathPoints!: Point[]
  towerColliders = new PointColliders()
  addingTower?: TDTower

  constructor(public readonly gameScene: TDGameScene) {
    super({ key: "play" })
  }

  preload() {

    this.load.audio('boop', "assets/audio/drop_003.ogg")
    this.load.audio('cash', "assets/audio/dropmetalthing.ogg")
    this.load.audio('explosion', "assets/audio/explosionCrunch_004.ogg")
    this.load.audio('gun', "assets/audio/GunShot.wav")
    this.load.audio('tick', "assets/audio/impactMetal_medium_002.ogg")
    this.load.audio('woe', "assets/audio/lowDown.ogg")
    this.load.audio('three', "assets/audio/lowThreeTone.ogg")
    this.load.audio('beboop', "assets/audio/pepSound1.ogg")
    this.load.audio('bip', "assets/audio/tone1.ogg")
    this.load.audio('lose', "assets/audio/you_lose.ogg")
    this.load.audio('win', "assets/audio/you_win.ogg")
    this.load.audio('plop', "assets/audio/impactPlate_heavy_004.ogg")
    this.load.audio('fail', "assets/audio/back_001.ogg")

    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json')
    this.load.image('fire', 'assets/particles/fire_01.png')
    this.load.image('smoke', 'assets/particles/smoke_01.png')
    this.load.image('ice', 'assets/particles/star_08.png')
    this.load.image('spark', 'assets/particles/spark_04.png')
    this.load.image('slash', 'assets/particles/slash_03.png')
    this.load.image('muzzle', 'assets/particles/muzzle_01.png')

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

  static createExplosionSprite(scene: Scene, x: number, y: number) {
    const frames: { key: string }[] = []
    for (let i = 0; i < 8; i++) {
      frames.push({ key: `explosion0${i}` })
    }
    shuffle(frames)
    if (!scene.anims.exists("explosion")) {
      scene.anims.create({
        key: "explosion",
        frames,
        frameRate: 8,
        repeat: 0
      })
    }
    const sprite = scene.add.sprite(x, y, "explosion00").setScale(0).play("explosion")
    scene.add.tween({
      targets: sprite,
      props: {
        alpha: { value: 0, duration: 1500, repeat: 0 },
        scale: { value: 0.4, duration: 1000, repeat: 0 }
      },
      ease: "Linear",
      onComplete: () => {
        sprite.destroy()
        // scene.sound.play("cash")
      }
    })
  }

  generatePathAdjacentPositions(origin: Point): Point[] {
    const { w, h } = canvasSize(this)
    const WEST = new Point(-64, 0)
    const EAST = new Point(64, 0)
    const NORTH = new Point(0, -64)
    const SOUTH = new Point(0, 64)
    const inRange = ({ x, y }: Point) => x > 0 && x < w - 64 * 2 && y > 64 && y < h - 64 * 2
    const pointSet = new Set<string>(this.pathPoints.map(p => p.toKey()))
    const towerSet = new Set<string>()
    const positions: Point[] = []
    for (let point of this.pathPoints) {
      // Include only odd positions
      if (Math.floor(point.x / 64) % 2 !== 0 && Math.floor(point.y / 64) % 2 !== 0) {
        const west = point.plus(WEST)
        const east = point.plus(EAST)
        const north = point.plus(NORTH)
        const south = point.plus(SOUTH)
        // Avoid recomputing keys each time
        const westKey = west.toKey()
        const eastKey = east.toKey()
        const northKey = north.toKey()
        const southKey = south.toKey()
        // console.log("Adjacencies:", point.toKey(), westKey, eastKey, northKey, southKey)

        if (inRange(west) && !pointSet.has(westKey) && !towerSet.has(westKey)) {
          towerSet.add(westKey)
          positions.push(west)
        }
        if (inRange(east) && !pointSet.has(eastKey) && !towerSet.has(eastKey)) {
          towerSet.add(eastKey)
          positions.push(east)
        }
        if (inRange(north) && !pointSet.has(northKey) && !towerSet.has(northKey)) {
          towerSet.add(northKey)
          positions.push(north)
        }
        if (inRange(south) && !pointSet.has(southKey) && !towerSet.has(southKey)) {
          towerSet.add(southKey)
          positions.push(south)
        }
      }
    }
    // console.log("Positions:", positions.map(x => x.toString()))
    shuffle(positions)
    return positions
  }

  create() {
    const enemyGroup = this.physics.add.group({ key: "enemyGroup" })

    // Tower Info
    const towerInfoVisible = new ObservableValue<boolean>(false)
    const onCloseTowerInfo = () => towerInfoVisible.value = false
    const selectedTower = new ObservableValue<TDTower | undefined>(undefined)
    addReactNode(this, 25, 75, <TowerInfo tower={selectedTower} onClose={onCloseTowerInfo} />, towerInfoVisible)

    this.towerGroup = this.physics.add.group({ key: "towerGroup" })
    this.towerSelectionManager = new SelectionManager(this.towerGroup, selectedTower, towerInfoVisible)
    // Clear selection when clicked outside a tower
    this.input.on(Input.Events.POINTER_DOWN, () => {
      this.towerSelectionManager.select(undefined)
      towerInfoVisible.value = false
    })

    this.createMap(enemyGroup)

    const origin = new Point(0, 46)

    const towerCount = 3
    const towers: TDTower[] = []

    const towerPositions: Point[] = this.generatePathAdjacentPositions(origin)
    const generateTower = (i: number) => {
      let pos: Point = towerPositions[i] // randomCell()
      const model = Utils.Array.GetRandom(ALL_TOWERS)
      return this.add.tower(pos.x, pos.y, model, this.towerSelectionManager)
    }
    for (let i = 0; i < towerCount; i++) {
      const tower = generateTower(i)
      towers.push(tower)
      // this.add.existing(tower)
      this.towerGroup.add(tower)
    }

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
      this.addingTower = this.add.tower(this.input.x, this.input.y, model, this.towerSelectionManager)
      if (this.addingTower) {
        this.addingTower.preview = true
        this.addingTower.showRange.visible = true
        this.towerSelectionManager.select(undefined)
        this.towerGroup.add(this.addingTower)
        const towerPoints = collectTowerPoints(this.addingTower)
        this.towerColliders.push(new PointCollider(towerPoints))
        this.towerColliders.push(new PointCollider(this.pathPoints))
      }
    }

    addReactNode(this, 0, 0, <GameHeader active={this.active} navigator={this.gameScene} />)
    addReactNode(this, 0, this.game.canvas.height - 62, <GameFooter scene={this} onAddTower={onAddTower} />)

    const showTowerPreview = false
    if (showTowerPreview) {
      const preview = new TowerPreview(this, 50, 70)
      this.add.existing(preview)
    }

    testPlasmaPath(this)
    // TDPlayScene.createExplosionSprite(this, 550, 400)
  }

  createMap(enemyGroup: GameObjects.Group) {
    this.pathPoints = generateMap(this, this.active, enemyGroup)
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
      if (tower.preview) {
        return
      }
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

  // accumulator = 0
  update(time: number, delta: number): void {
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
          this.sound.play("fail")
        } else {
          this.addingTower.preview = false
          this.sound.play("plop")
        }
        this.addingTower.showRange.visible = false
        this.addingTower = undefined
      }
    }
  }
}
