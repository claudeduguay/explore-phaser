
import { Scene, Utils, Math as PMath, Input, Geom, GameObjects, Time } from "phaser"
import { addReactNode } from "../../../util/DOMUtil"
import TDTower from "../entity/tower/TDTower"
import TDGameScene from "./TDGameScene"
import generateMap from "./map/TDLevel"
import Point from "../../../util/geom/Point"
import SelectableGroup from "./SelectableGroup"
import ITowerModel, { TOWER_LIST } from "../entity/model/ITowerModel"
import TowerInfo from "./react/TowerInfo"
import registerTowerTextures from "../assets/TowerTextures"
import ObservableValue from "../value/ObservableValue"
import { shuffle } from "../../../util/ArrayUtil"
import { sceneSize } from "../../../util/SceneUtil"
import EnemyInfo from "./react/EnemyInfo"
import TDEnemy from "../entity/enemy/TDEnemy"
import { connectTowerEnemyCollisionDetection } from "../entity/tower/Targeting"
import TowerSelector from "./TowerSelector"
import TDHUDScene from "./TDHUDScene"
import { TDTileMap } from "./map/TDTileMap"
import { generatePathAdjacentPositions } from "./map/TDPath"
// import Conversation from "../gui/Conversation"
// import { ButtonTreeExample } from "../tree/ButtonTree"

export interface IActiveValues {
  health: ObservableValue<number>,
  credits: ObservableValue<number>
}

export default class TDPlayScene extends Scene {

  health = new ObservableValue(100)
  credits = new ObservableValue(0)
  towerGroup!: SelectableGroup<TDTower>
  enemyGroup!: SelectableGroup<TDEnemy>
  previewGroup!: GameObjects.Group
  selectors: TowerSelector[] = []
  hud!: TDHUDScene
  map!: TDTileMap
  timeline!: Time.Timeline
  addingTower?: TDTower

  mapOrigin = new Point(0, 0)


  constructor(public readonly main: TDGameScene) {
    super("play")
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

  create() {

    // INIT HUD SCENE (Note: WE WANT TO ENCAPSULATE CHILDREN AND MOVE THEM INTO THIS SCENE)
    this.hud = new TDHUDScene(this.main, this.health, this.credits)
    this.scene.add("hud", this.hud)
    this.scene.launch("hud")

    const { w } = sceneSize(this)
    // this.lights.addPointLight(-w / 2, -h / 2, 0xffffff, Math.max(w, h) * 2, 2, 0.01)
    // console.log("Added lights:", this.lights.lights)

    // Tower Info
    this.towerGroup = new SelectableGroup(this, "towerGroup")
    // @ts-ignore
    this.physics.add.existing(this.towerGroup)
    const onCloseTowerInfo = () => this.towerGroup.infoVisible.value = false
    addReactNode(this, <TowerInfo scene={this} tower={this.towerGroup.selected} onClose={onCloseTowerInfo} />,
      -400, 75, 45, 75, this.towerGroup.infoVisible, true)

    // Enemy Info
    this.enemyGroup = new SelectableGroup(this, "enemyGroup")
    // @ts-ignore
    this.physics.add.existing(this.enemyGroup)
    const onCloseEnemyInfo = () => this.enemyGroup.infoVisible.value = false
    // Enemies are created as the timeline moves, so we can't take the first entry of the group
    this.enemyGroup.infoVisible.value = false
    addReactNode(this, <EnemyInfo scene={this} enemy={this.enemyGroup.selected} onClose={onCloseEnemyInfo} />,
      w + 5, 75, w - 350 - 20, 75, this.enemyGroup.infoVisible, true)

    this.previewGroup = new GameObjects.Group(this)

    // >>> ZOOM HANDLER <<<
    this.input.on(Input.Events.POINTER_WHEEL, (pointer: Input.Pointer, over: any, deltaX: number, deltaY: number, deltaZ: number) => {
      if (deltaY < 0) {
        const zoom = this.cameras.main.zoom
        this.cameras.main.setZoom(Math.min(4, zoom * 2))
      } else {
        const zoom = this.cameras.main.zoom
        this.cameras.main.setZoom(Math.max(0.25, zoom * 0.5))
      }
    })

    // Clear selections when clicked outside info panel or tower selector
    this.input.on(Input.Events.POINTER_DOWN, ({ x, y }: Input.Pointer) => {
      this.towerGroup.select(undefined)
      this.enemyGroup.select(undefined)
      this.selectors.forEach(selector => {
        // Close selectors if not inside one
        if (!Geom.Rectangle.Contains(selector.getBounds(), x, y)) {
          selector.isOpen = false
        }
      })
    })
    // Close selectors and EnemyInfo if TowerInfo is opened
    this.towerGroup.infoVisible.addListener("changed", (value: boolean) => {
      if (value) {
        this.enemyGroup.select(undefined)
        this.selectors.forEach(selector => {
          selector.isOpen = false
        })
      }
    })
    // Close selectors and TowerInfo if EnemyInfo is opened
    this.enemyGroup.infoVisible.addListener("changed", (value: boolean) => {
      if (value) {
        this.towerGroup.select(undefined)
        this.selectors.forEach(selector => {
          selector.isOpen = false
        })
      }
    })

    this.createMap()

    // Detect Collisions between tower and enemy group members
    connectTowerEnemyCollisionDetection(this, this.towerGroup, this.enemyGroup)


    // ------------------------------------------------------------------
    // ADD TOWER MECHANICS
    // ------------------------------------------------------------------

    let onAddTower = (model: ITowerModel) => {
      this.addingTower = this.add.tower(this.input.x, this.input.y, model)
      if (this.addingTower) {
        this.addingTower.preview = true
        this.addingTower.showRange.visible = true
        this.towerGroup.select(undefined)
      }
    }

    // Need to capture onAddTower in play scene
    this.selectors = [
      new TowerSelector(this, 0, 100, "eject", onAddTower),
      new TowerSelector(this, 0, 200, "beam", onAddTower),
      new TowerSelector(this, 0, 300, "spray", onAddTower),
      new TowerSelector(this, 0, 400, "cloud", onAddTower),
      new TowerSelector(this, 0, 500, "vertical", onAddTower),
      new TowerSelector(this, 0, 600, "expand", onAddTower),
      new TowerSelector(this, 0, 700, "area", onAddTower)
    ]
    this.hud.addSelectors(this.selectors)
    setTimeout(() => this.hud.buttonBar.access.replay.onClick = () => this.createMap(), 0)


    // ------------------------------------------------------------------
    // TEST CONTENT
    // ------------------------------------------------------------------

    // addReactNode(this, 50, 50, <ButtonTreeExample width={w - 100} height={h - 100} />)

    // addMaterialIcon(this, 50, 75, 0xe87d, 64, "red")
    // addMaterialIcon(this, 150, 75, 0xe227, 64, "green")
    // addMaterialIcon(this, 250, 75, 0xe88a, 64, "blue")

    // const conversation = new Conversation(this, 200, 570, 700, 200)
    // this.add.existing(conversation)

  }

  generateSemiRandomTowers(points: Point[], count: number = 5) {
    const validTowerPositions: Point[] = generatePathAdjacentPositions(this, points)
    for (let i = 0; i < count; i++) {
      let pos: Point = validTowerPositions[i % (validTowerPositions.length - 1)]
      const model = Utils.Array.GetRandom(TOWER_LIST)
      const tower = this.add.tower(pos.x, pos.y, model)
      this.towerGroup.add(tower)
      this.map.addTowerMarkAt(pos)
    }
  }

  createMap() {
    if (this.timeline) {
      this.timeline.stop()
      this.timeline.destroy()
      this.previewGroup.clear(true, true)
      this.enemyGroup.clear(true, true)
      this.towerGroup.clear(true, true)
      this.health.value = 100
      this.credits.value = 0
    }
    const { map, points, timeline } = generateMap(this, this.hud,
      this.health, this.credits, this.enemyGroup, this.previewGroup, this.mapOrigin)
    this.map = map
    this.timeline = timeline
    const showSpriteSheet = false
    if (showSpriteSheet) {
      const g = this.add.graphics()
      const margin = 10
      const x = 38
      g.fillStyle(0xCCCCFF, 1)
      g.fillRect(x - margin, 590 - margin, 16 * 64 + margin * 2, 64 + margin * 2)
      this.add.sprite(x, 590, "path_tiles").setOrigin(0, 0)
    }
    const addSemiRandomTowers = true
    if (addSemiRandomTowers) {
      this.generateSemiRandomTowers(points)
    }
  }


  update(time: number, delta: number): void {
    if (this.addingTower) {
      const x = PMath.Snap.Floor(this.input.x - this.mapOrigin.x, 64) + 32 + this.mapOrigin.x
      const y = PMath.Snap.Floor(this.input.y - this.mapOrigin.y, 64) + 32 + this.mapOrigin.y
      const pos = new Point(x, y)
      if (!this.input.mousePointer.isDown) {
        this.input.setDefaultCursor("none")

        // Highlight invalid positions
        if (this.map.checkCollision(pos)) {
          this.addingTower.platform.setTint(0xff0000)
        } else {
          this.addingTower.platform.clearTint()
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
          this.map.addTowerMarkAt(pos)
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
