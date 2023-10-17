
import { Scene, Utils, Math as PMath, Input } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../entity/tower/TDTower"
import TDGameScene from "./TDGameScene"
import GameHeader from "./react/GameHeader"
import GameFooter from "./react/GameFooter"
import generateMap from "./map/TDLevel"
import Point from "../../../util/Point"
import SelectableGroup from "./SelectableGroup"
import ITowerModel, { TOWER_LIST } from "../entity/model/ITowerModel"
import TowerPreview from "../entity/tower/TowerPreview"
import PointCollider, { PointColliders } from "../../../util/PointCollider"
import TowerInfo from "./react/TowerInfo"
import registerTowerTextures from "../assets/TowerTextures"
import ObservableValue from "../value/ObservableValue"
import { shuffle } from "../../../util/ArrayUtil"
import { canvasSize } from "../../../util/SceneUtil"
import EnemyInfo from "./react/EnemyInfo"
import TDEnemy from "../entity/enemy/TDEnemy"
import { ENEMY_LIST } from "../entity/model/IEnemyModel"
import { onEnemyInRange, onEnemyOverlap } from "../entity/tower/Targeting"
import TreePreview from "../tree/TreePreview"
// import { ButtonTreeExample } from "../tree/ButtonTree"

export interface IActiveValues {
  health: ObservableValue<number>,
  credits: ObservableValue<number>
}

export default class TDPlayScene extends Scene {

  active: IActiveValues = {
    health: new ObservableValue(100),
    credits: new ObservableValue(0)
  }
  towerGroup!: SelectableGroup<TDTower>
  enemyGroup!: SelectableGroup<TDEnemy>
  pathPoints!: Point[]
  towerColliders = new PointColliders()
  addingTower?: TDTower
  towerPreview!: TowerPreview
  treePreview!: TreePreview

  mapOrigin = new Point(0, 48)


  constructor(public readonly parent: TDGameScene) {
    super({ key: "play" })
  }

  preload() {
    // Most assets are loaded in TDGameScene via preloadAssets function
    registerTowerTextures(this)
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

  generatePathAdjacentPositions(): Point[] {
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
    const { w, h } = canvasSize(this)
    this.lights.addLight(-w / 2, -h / 2, w * 2, 0xffffff, 1).setIntensity(2)
    // console.log("Added lights:", this.lights.lights)

    // Tower Info
    this.towerGroup = new SelectableGroup(this, "towerGroup")
    const onCloseTowerInfo = () => this.towerGroup.infoVisible.value = false
    // @ts-ignore
    this.physics.add.existing(this.towerGroup)
    addReactNode(this, -400, 75, 25, 75, <TowerInfo scene={this} tower={this.towerGroup.selected} onClose={onCloseTowerInfo} />,
      this.towerGroup.infoVisible, true)

    // Enemy Info
    this.enemyGroup = new SelectableGroup(this, "enemyGroup")
    const onCloseEnemyInfo = () => this.enemyGroup.infoVisible.value = false
    // @ts-ignore
    this.physics.add.existing(this.enemyGroup)
    // Enemies are created as the timeline moves, so we can't take the first entry of the group
    this.enemyGroup.select(new TDEnemy(this, 0, 0, ENEMY_LIST[0]))
    this.enemyGroup.infoVisible.value = false
    addReactNode(this, w + 5, 75, w - 350 - 25, 75, <EnemyInfo scene={this} enemy={this.enemyGroup.selected} onClose={onCloseEnemyInfo} />,
      this.enemyGroup.infoVisible, true)

    // Clear selections when clicked outside info panel
    this.input.on(Input.Events.POINTER_DOWN, () => {
      this.towerGroup.select(undefined)
      this.enemyGroup.select(undefined)
      this.towerGroup.infoVisible.value = false
      this.enemyGroup.infoVisible.value = false
    })

    this.createMap() // Call this before selecting enemy

    const towerCount = 5
    const towers: TDTower[] = []

    const towerPositions: Point[] = this.generatePathAdjacentPositions()
    const generateTower = (i: number) => {
      let pos: Point = towerPositions[i]
      const model = Utils.Array.GetRandom(TOWER_LIST)
      return this.add.tower(pos.x, pos.y, model)
    }
    for (let i = 0; i < towerCount; i++) {
      const tower = generateTower(i)
      towers.push(tower)
      this.towerGroup.add(tower)
    }

    this.physics.add.overlap(this.towerGroup, this.enemyGroup, onEnemyOverlap, onEnemyInRange)

    // Preview NineSlice
    // this.add.sprite(50, 590, "nine_slice").setOrigin(0)

    // const fireRange = 220
    // this.add.particles(10, 765, 'fire', fireEmitter(fireRange))
    // this.add.rectangle(10, 795, fireRange, 2, 0xFFFFFF).setOrigin(0, 0)
    // this.add.particles(950, 795, 'smoke', cloudEmitter())

    // ------------------------------------------------------------------
    // START ADD TOWER MECHANICS
    // ------------------------------------------------------------------

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


    // ------------------------------------------------------------------
    // TOWER SCENE PREVIEW
    // ------------------------------------------------------------------

    const onToggleTowerPreview = () => {
      if (this.scene.isActive("tower_preview")) {
        this.scene.sleep("tower_preview")
      } else {
        this.scene.wake("tower_preview")
      }
    }
    this.towerPreview = new TowerPreview(this, 50, 58)
    this.scene.add("tower_preview", this.towerPreview, true)
    this.scene.sleep("tower_preview")


    // ------------------------------------------------------------------
    // TREE SCENE PREVIEW
    // ------------------------------------------------------------------

    const onToggleTreePreview = () => {
      if (this.scene.isActive("tree_preview")) {
        this.scene.sleep("tree_preview")
      } else {
        this.scene.wake("tree_preview")
      }
    }
    this.treePreview = new TreePreview(this, 50, 50)
    this.scene.add("tree_preview", this.treePreview, true)
    this.scene.sleep("tree_preview")


    addReactNode(this, 0, 0, 0, 0, <GameHeader scene={this} active={this.active} navigator={this.parent}
      onToggleTowerPreview={onToggleTowerPreview} onToggleTreePreview={onToggleTreePreview} />)
    addReactNode(this, 0, this.game.canvas.height - 48, 0, this.game.canvas.height - 48,
      <GameFooter scene={this} onAddTower={onAddTower} />)
    // addReactNode(this, 50, 50, <ButtonTreeExample width={w - 100} height={h - 100} />)
  }


  createMap() {
    this.pathPoints = generateMap(this, this.active, this.enemyGroup, this.mapOrigin)
    const showSpriteSheet = false
    if (showSpriteSheet) {
      const g = this.add.graphics()
      const margin = 10
      const x = 38
      g.fillStyle(0xCCCCFF, 1)
      g.fillRect(x - margin, 590 - margin, 16 * 64 + margin * 2, 64 * 2 + margin * 2)
      this.add.sprite(x, 590, "path_tiles").setOrigin(0, 0)
    }
  }


  update(time: number, delta: number): void {
    if (this.addingTower) {
      if (!this.input.mousePointer.isDown) {
        this.input.setDefaultCursor("none")
        const x = PMath.Snap.Floor(this.input.x, 64) + this.mapOrigin.x + 32
        const y = PMath.Snap.Floor(this.input.y, 64) + this.mapOrigin.y - 32

        // Highlight invalid positions
        if (!this.towerColliders.collision(new Point(x, y))) {
          this.addingTower.platform.clearTint()
        } else {
          this.addingTower.platform.setTint(0xff0000)
        }
        this.addingTower.setPosition(x, y)
      } else {
        this.input.setDefaultCursor("default")
        if (this.addingTower.platform.isTinted) {
          this.addingTower.destroy()
          if (this.sound.get("fail")) {
            this.sound.play("fail")
          }
        } else {
          this.towerGroup.add(this.addingTower)
          this.addingTower.preview = false
          if (this.sound.get("plop")) {
            this.sound.play("plop")
          }
        }
        this.addingTower.showRange.visible = false
        this.addingTower = undefined
      }
    }
  }
}
