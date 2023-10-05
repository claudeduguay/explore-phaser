
import { Scene, GameObjects, Types, Utils, Math as PMath, Input } from "phaser"
import { makeHeightRects } from "../assets/TextureFactory"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../tower/TDTower"
import TDGameScene from "./TDGameScene"
import GameHeader from "./react/GameHeader"
import GameFooter from "./react/GameFooter"
import generateMap from "./map/TDLevel"
import Point from "../../../util/Point"
import SelectableGroup from "./SelectableGroup"
import ITowerModel, { ALL_TOWERS } from "../model/ITowerModel"
import TowerPreview from "../tower/TowerPreview"
import PointCollider, { PointColliders } from "../../../util/PointCollider"
import TowerInfo from "./react/TowerInfo"
import registerTowerTextures from "../assets/TowerTextures"
import ActiveValue from "../value/ActiveValue"
import { shuffle } from "../../../util/ArrayUtil"
import { testPlasmaPath } from "../behavior/TargetPlasmaBehavior"
import { canvasSize } from "../../../util/SceneUtil"
import EnemyInfo from "./react/EnemyInfo"
import TDEnemy from "../enemy/TDEnemy"
import { ENEMY_MODELS } from "../model/IEnemyModel"

export interface IActiveValues {
  health: ActiveValue,
  credits: ActiveValue
}

export default class TDPlayScene extends Scene {

  active: IActiveValues = {
    health: new ActiveValue(100, 0, 1000),
    credits: new ActiveValue(0, 0, 1000)
  }
  towerGroup!: SelectableGroup<TDTower>
  enemyGroup!: SelectableGroup<TDEnemy>
  pathPoints!: Point[]
  towerColliders = new PointColliders()
  addingTower?: TDTower
  towerPreview!: TowerPreview

  constructor(public readonly parent: TDGameScene) {
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
    this.load.image('rain', 'assets/particles/trace_01.png')
    this.load.image('snow', 'assets/particles/star_05.png')
    this.load.image('spark', 'assets/particles/spark_04.png')
    this.load.image('slash', 'assets/particles/slash_03.png')
    this.load.image('muzzle', 'assets/particles/muzzle_01.png')

    makeHeightRects(this, "height_cells", 64, 64, 10)

    registerTowerTextures(this)

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
    const { w } = canvasSize(this)

    // Tower Info
    this.towerGroup = new SelectableGroup(this, "towerGroup")
    const onCloseTowerInfo = () => this.towerGroup.infoVisible.value = false
    // @ts-ignore
    this.physics.add.existing(this.towerGroup)
    addReactNode(this, 25, 75, <TowerInfo tower={this.towerGroup.selected} onClose={onCloseTowerInfo} />,
      this.towerGroup.infoVisible, true)

    // Enemy Info
    this.enemyGroup = new SelectableGroup(this, "enemyGroup")
    const onCloseEnemyInfo = () => this.enemyGroup.infoVisible.value = false
    // @ts-ignore
    this.physics.add.existing(this.enemyGroup)
    // Enemies are created as the timeline moves, so we can't take the first entry of the group
    this.enemyGroup.select(new TDEnemy(this, 0, 0, ENEMY_MODELS.WEAK))
    this.enemyGroup.infoVisible.value = false
    addReactNode(this, w - 350 - 25, 75, <EnemyInfo enemy={this.enemyGroup.selected} onClose={onCloseEnemyInfo} />,
      this.enemyGroup.infoVisible, true)

    // Clear selections when clicked outside info panel
    this.input.on(Input.Events.POINTER_DOWN, () => {
      this.towerGroup.select(undefined)
      // this.enemyGroup.select(undefined)
      this.towerGroup.infoVisible.value = false
      this.enemyGroup.infoVisible.value = false
    })

    this.createMap() // Call this before selecting enemy

    const origin = new Point(0, 46)

    const towerCount = 5
    const towers: TDTower[] = []

    const towerPositions: Point[] = this.generatePathAdjacentPositions(origin)
    const generateTower = (i: number) => {
      let pos: Point = towerPositions[i]
      const model = Utils.Array.GetRandom(ALL_TOWERS)
      return this.add.tower(pos.x, pos.y, model)
    }
    for (let i = 0; i < towerCount; i++) {
      const tower = generateTower(i)
      towers.push(tower)
      this.towerGroup.add(tower)
    }

    this.physics.add.overlap(this.towerGroup, this.enemyGroup, this.onEnemyOverlap)

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
      this.addingTower = this.add.tower(this.input.x, this.input.y, model)
      if (this.addingTower) {
        this.addingTower.preview = true
        this.addingTower.showRange.visible = true
        this.towerGroup.select(undefined)
        const towerPoints = collectTowerPoints(this.addingTower)
        this.towerColliders.push(new PointCollider(towerPoints))
        this.towerColliders.push(new PointCollider(this.pathPoints))
      }
    }

    addReactNode(this, 0, 0, <GameHeader scene={this} active={this.active}
      navigator={this.parent} onToggleTowerPreview={() => {
        if (this.scene.isActive("tower_preview")) {
          this.scene.sleep("tower_preview")
        } else {
          this.scene.wake("tower_preview")
        }
      }} />)
    addReactNode(this, 0, this.game.canvas.height - 62, <GameFooter scene={this} onAddTower={onAddTower} />)

    this.towerPreview = new TowerPreview(this, 50, 58)
    this.scene.add("tower_preview", this.towerPreview, true)
    this.scene.sleep("tower_preview")

    // testPlasmaPath(this)
    // TDPlayScene.createExplosionSprite(this, 550, 400)
  }

  createMap() {
    this.pathPoints = generateMap(this, this.active, this.enemyGroup)
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
          this.towerGroup.add(this.addingTower)
          this.sound.play("plop")
        }
        this.addingTower.showRange.visible = false
        this.addingTower = undefined
      }
    }
  }
}
