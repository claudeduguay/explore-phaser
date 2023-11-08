import { Input, Scene, Scenes } from "phaser";
import SpeedBar from "../gui/game/SpeedBar";
import ValueMonitor from "../gui/game/ValueMonitor";
import ButtonBar from "../gui/game/ButtonBar";
import TowerPreview from "../entity/tower/TowerPreview";
import GUIPreview from "../gui/GUIPreview";
import TreePreview from "../tree/TreePreview";
import TowerSelector from "./TowerSelector";
import TowerPlacement from "./TowerPlacement";
import TDPlayScene from "./TDPlayScene";
import { makeTimelinePreviewGraphics } from "./map/TDTimeline";
import TDInfoTower from "./TDInfoTower";
import { sceneSize } from "../../../util/SceneUtil";
import TDInfoEnemy from "./TDInfoEnemy";
import TDEnemy from "../entity/enemy/TDEnemy";
import StylePreview from "../entity/tower/StylePreview";

export default class TDHUDScene extends Scene {

  buttonBar!: ButtonBar
  placement!: TowerPlacement
  selectors: TowerSelector[] = []

  constructor(public readonly playScene: TDPlayScene) {
    super("hud")
    // Connect sleep/wake events to deactivate/activate HUD at the same time
    playScene.events.on(Scenes.Events.SLEEP, () => {
      this.scene.sleep("hud")
    })
    playScene.events.on(Scenes.Events.TRANSITION_WAKE, () => {
      this.scene.restart()
      this.playScene.createMap()
    })
  }

  makeTogglePreviewFunction(scene: Scene, key: string, previews: string[]) {
    const sleepIfOther = (other: string) => other !== key && this.scene.sleep(other)
    const putOthersToSleep = () => previews.forEach(sleepIfOther)
    return () => {
      if (!this.scene.get(key)) {
        this.scene.add(key, scene, true)
        putOthersToSleep()
        return
      }
      if (this.scene.isActive(key)) {
        this.scene.sleep(key)
      } else {
        putOthersToSleep()
        this.scene.wake(key)
      }
    }
  }

  create() {
    // IMPORTANT: "this.add" is not available in constructor, so we use create() 

    // Value monitors (left)
    this.add.existing(new ValueMonitor(this, 10, 7, 0xe87d, "red", this.playScene.health))
    this.add.existing(new ValueMonitor(this, 120, 7, 0xe227, "green", this.playScene.credits))

    const towerPreview = new TowerPreview(this, 50, 50)
    const treePreview = new TreePreview(this, 50, 50)
    const guiPreview = new GUIPreview(this, 50, 50)
    const stylePreview = new StylePreview(this, 50, 50)
    const previews = ["tower_preview", "tree_preview", "gui_preview"]
    const onToggleTowerPreview = this.makeTogglePreviewFunction(towerPreview, "tower_preview", previews)
    const onToggleTreePreview = this.makeTogglePreviewFunction(treePreview, "tree_preview", previews)
    const onToggleGUIPreview = this.makeTogglePreviewFunction(guiPreview, "gui_preview", previews)
    const onToggleStylePreview = this.makeTogglePreviewFunction(stylePreview, "style_preview", previews)

    // Button bars (right)
    this.add.existing(new SpeedBar(this, 960, -4))
    this.buttonBar = new ButtonBar(this, 710, -4)
    this.buttonBar.access.towers.onClick = onToggleTowerPreview
    this.buttonBar.access.tree.onClick = onToggleTreePreview
    this.buttonBar.access.gui.onClick = onToggleGUIPreview
    this.buttonBar.access.style.onClick = onToggleStylePreview
    this.buttonBar.access.replay.onClick = () => this.playScene.createMap()

    this.add.existing(this.buttonBar)

    makeTimelinePreviewGraphics(this)

    this.addSelectors()

    const { w } = sceneSize(this)
    this.add.existing(new TDInfoTower(this, w + 100, 75, this.playScene.towerGroup))
    this.add.existing(new TDInfoEnemy(this, -450, 75, this.playScene.enemyGroup))

    // For numerical input from 1-9, select the first enemy with that level
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    this.input.keyboard?.on(Input.Keyboard.Events.ANY_KEY_UP, (event: KeyboardEvent) => {
      if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
        const index = Number.parseInt(event.key)
        const enemies = this.playScene.enemyGroup.children.entries
        const matchLevel = (e: any) => e.model.general.level === index
        const selection = enemies.find(matchLevel) as TDEnemy | undefined
        this.playScene.enemyGroup.select(selection)
      }
    })
  }

  addSelectors() {
    this.placement = new TowerPlacement(this.playScene, this)
    this.playScene.add.existing(this.placement)

    // Need to capture onAddTower in play scene
    this.selectors = [
      new TowerSelector(this, 0, 100, this.playScene.credits, "eject", this.placement.onAddTower),
      new TowerSelector(this, 0, 200, this.playScene.credits, "beam", this.placement.onAddTower),
      new TowerSelector(this, 0, 300, this.playScene.credits, "spray", this.placement.onAddTower),
      new TowerSelector(this, 0, 400, this.playScene.credits, "cloud", this.placement.onAddTower),
      new TowerSelector(this, 0, 500, this.playScene.credits, "vertical", this.placement.onAddTower),
      new TowerSelector(this, 0, 600, this.playScene.credits, "expand", this.placement.onAddTower),
      new TowerSelector(this, 0, 700, this.playScene.credits, "area", this.placement.onAddTower)
    ]
    for (let selector of this.selectors) {
      selector.setScrollFactor(0) // Doesn't seem to help
      selector.group = this.selectors
      this.add.existing(selector)
    }
    return this.selectors
  }
}
