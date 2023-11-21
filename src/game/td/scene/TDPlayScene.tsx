
import { Scene, Input, Geom, GameObjects, Time } from "phaser"
import TDTower from "../entity/tower/TDTower"
import TDGameScene from "./TDGameScene"
import generateMap from "./map/TDLevel"
import Point from "../../../util/geom/Point"
import SelectableGroup from "./SelectableGroup"
import { GENERATED_LIST, TOWER_LIST } from "../entity/model/ITowerModel"
import registerTowerTextures from "../assets/TowerTextures"
import ObservableValue from "../value/ObservableValue"
import { shuffle } from "../../../util/ArrayUtil"
import TDEnemy from "../entity/enemy/TDEnemy"
import { connectTowerEnemyCollisionDetection } from "../entity/tower/Targeting"
import TDHUDScene from "./TDHUDScene"
import { DEFAULT_CONFIG, TDTileMap } from "./map/TDTileMap"
import { generatePathAdjacentPositions } from "./map/TDPath"
import Conversation from "../gui/game/Conversation"
import { play, sceneSize } from "../../../util/SceneUtil"
import { randomChoice } from "../../../util/Random"
import { ILevelModel, generateLevel } from "./map/ILevelModel"
import { radial } from "../gui/Radial"
import { TYPES_DAMAGE, TYPES_DELIVERY } from "../entity/model/ITowerData"
// import { ButtonTreeExample } from "../tree/ButtonTree"

export interface IActiveValues {
  health: ObservableValue<number>,
  credits: ObservableValue<number>
}

export default class TDPlayScene extends Scene {

  health = new ObservableValue(100)
  credits = new ObservableValue(200)
  towerGroup!: SelectableGroup<TDTower>
  enemyGroup!: SelectableGroup<TDEnemy>
  previewGroup!: GameObjects.Group
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
        play(scene, "cash")
      }
    })
  }

  create() {

    // const machine = this.add.statemachine("Test", ValidateTransitions.Log)  // Using the object factory registers for auto-updates  
    // machine.addState("home", { onEnter: () => console.log("Enter Home"), onExit: () => console.log("Exit Home") })
    // machine.addState("next", { onEnter: () => console.log("Enter Next") })
    // machine.addTransition("home", "next")
    // machine.transitionTo("home")
    // machine.transitionTo("next")

    // this.lights.addPointLight(-w / 2, -h / 2, 0xffffff, Math.max(w, h) * 2, 2, 0.01)
    // console.log("Added lights:", this.lights.lights)

    // INIT HUD SCENE (Note: WE WANT TO ENCAPSULATE CHILDREN AND MOVE THEM INTO THIS SCENE)
    this.hud = new TDHUDScene(this)
    this.scene.add("hud", this.hud)
    this.scene.launch("hud")

    this.initGroups()
    this.initInputEventHandlers()

    this.generateMap()

    // Detect Collisions between tower and enemy group members
    connectTowerEnemyCollisionDetection(this, this.towerGroup, this.enemyGroup)

    // setTimeout(() => {
    //   const firstChild = this.enemyGroup.children.entries[0] as TDEnemy
    //   console.log("First child:", firstChild)
    //   this.enemyGroup.select(firstChild)
    // }, 2000)


    // ------------------------------------------------------------------
    // TEST CONTENT
    // ------------------------------------------------------------------

    // addReactNode(this, 50, 50, <ButtonTreeExample width={w - 100} height={h - 100} />)

    // addMaterialIcon(this, 50, 75, 0xe87d, 64, "red")
    // addMaterialIcon(this, 150, 75, 0xe227, 64, "green")
    // addMaterialIcon(this, 250, 75, 0xe88a, 64, "blue")

    const conversation = new Conversation(this, 200, 570, 700, 200)
    conversation.y = 750 - conversation.getBounds().height
    // this.hud.add.existing(conversation)

    const { w, h } = sceneSize(this)
    const cx = w / 2
    const cy = h / 2 + 15
    const omenu = radial(this.hud, cx, cy, 330, 330, TYPES_DELIVERY)
    this.hud.add.existing(omenu)
    const imenu = radial(this.hud, cx, cy, 260, 260, TYPES_DAMAGE)
    this.hud.add.existing(imenu)
    const choices = this.hud.add.container(cx, cy)
    choices.add(this.hud.add.circle(0, 0, 230, 0x999999, 0.5))
    this.hud.add.existing(choices)

    const towers = GENERATED_LIST.filter(t => t.organize.delivery === TYPES_DELIVERY[0])
    // const towers = GENERATED_LIST.filter(t => t.organize.damage === TYPES_DAMAGE[0])
    for (let iy = 0; iy < 4; iy++) {
      for (let ix = 0; ix < 4; ix++) {
        const i = ix + iy * 4
        const x = ix * 80 - 125
        const y = iy * 80 - 125
        choices.add(this.hud.add.tower(x, y, towers[i]))
      }
    }

  }

  deleteTower(tower: TDTower) {
    this.map.clearTowerMarkAt(tower)
    this.towerGroup.remove(tower)
    tower.destroy()
  }

  initGroups() {
    // Used for Peep cleanup on replay events
    this.previewGroup = new GameObjects.Group(this)

    // Tower Group/Info
    this.towerGroup = new SelectableGroup(this, "towerGroup")

    // Enemy Group/Info
    this.enemyGroup = new SelectableGroup(this, "enemyGroup")
  }

  initInputEventHandlers() {

    // >>> ZOOM HANDLER <<<
    // May be useful: https://stackoverflow.com/questions/62947381/trying-to-get-mouse-wheel-zoom-effect-in-phaser
    this.input.on(Input.Events.POINTER_WHEEL, (pointer: Input.Pointer, over: any, deltaX: number, deltaY: number, deltaZ: number) => {
      const camera = this.cameras.main
      if (deltaY < 0) {
        const zoom = camera.zoom
        camera.setZoom(Math.min(4, zoom * 1.5))
      } else {
        const zoom = camera.zoom
        camera.setZoom(Math.max(0.25, zoom * 0.75))
      }
      this.cameras.main.centerOn(pointer.worldX, pointer.worldY)
      this.cameras.main.pan(pointer.worldX, pointer.worldY, 2000, "Power2")
    })
    // >>> PAN HANDLER <<<
    this.input.on(Input.Events.POINTER_MOVE, (pointer: Input.Pointer) => {
      if (pointer.isDown && !this.hud.placement.placingTower) {
        const camera = this.cameras.main
        camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom
        camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom
      }
    })
    // >>> HOME (RESET CAMERA) HANDLER <<<
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    this.input.keyboard?.on(Input.Keyboard.Events.ANY_KEY_UP, (event: KeyboardEvent) => {
      if (event.key === "Home") { // keyCode is deprecated
        const camera = this.cameras.main
        camera.setScroll(0)
        camera.zoom = 1.0
      }
    })

    // Clear selections when clicked outside info panel or tower selector
    this.input.on(Input.Events.POINTER_DOWN, ({ x, y }: Input.Pointer) => {
      this.towerGroup.select(undefined)
      this.enemyGroup.select(undefined)
      this.hud.selectors.forEach(selector => {
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
        this.hud.selectors.forEach(selector => {
          selector.isOpen = false
        })
      }
    })

    // Close selectors and TowerInfo if EnemyInfo is opened
    this.enemyGroup.infoVisible.addListener("changed", (value: boolean) => {
      if (value) {
        this.towerGroup.select(undefined)
        this.hud.selectors.forEach(selector => {
          selector.isOpen = false
        })
      }
    })
  }

  generateSemiRandomTowers(points: Point[], count: number = 5) {
    const validTowerPositions: Point[] = generatePathAdjacentPositions(this, points)
    for (let i = 0; i < count; i++) {
      let pos: Point = validTowerPositions[i] // These are shuffled during generation
      const model = randomChoice(TOWER_LIST)
      // const model = TOWER_INDEX.spike
      const tower = this.add.tower(pos.x, pos.y, model)
      this.towerGroup.add(tower)
      this.map.addTowerMarkAt(pos)
    }
  }

  generateMap() {
    this.setLevel(generateLevel(DEFAULT_CONFIG))
  }

  setLevel(level: ILevelModel, addSemiRandomTowers = true) {
    if (this.timeline) {
      this.timeline.stop()
      this.timeline.destroy()
      this.previewGroup.clear(true, true)
      this.enemyGroup.clear(true, true)
      this.towerGroup.clear(true, true)
      this.health.value = 100
      this.credits.value = 200
    }
    const { map, points, timeline } = generateMap(this, this.hud,
      this.health, this.credits, this.enemyGroup, this.previewGroup, this.mapOrigin, level)
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

    if (addSemiRandomTowers) {
      this.generateSemiRandomTowers(points)
    }
  }
}
