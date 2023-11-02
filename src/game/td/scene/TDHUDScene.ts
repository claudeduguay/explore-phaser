import { Scene, Scenes } from "phaser";
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

export default class TDHUDScene extends Scene {
  buttonBar!: ButtonBar
  selectors: TowerSelector[] = []
  towerPreview!: TowerPreview
  treePreview!: TreePreview
  guiPreview!: GUIPreview

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
    // IMPORTANT: this.add is not available in constructor, so we use create() 

    // Value monitors (left)
    this.add.existing(new ValueMonitor(this, 10, 7, 0xe87d, "red", this.playScene.health))
    this.add.existing(new ValueMonitor(this, 120, 7, 0xe227, "green", this.playScene.credits))

    const towerPreview = new TowerPreview(this, 50, 50)
    const treePreview = new TreePreview(this, 50, 50)
    const guiPreview = new GUIPreview(this, 50, 50)
    const previews = ["tower_preview", "tree_preview", "gui_preview"]
    const onToggleTowerPreview = this.makeTogglePreviewFunction(towerPreview, "tower_preview", previews)
    const onToggleTreePreview = this.makeTogglePreviewFunction(treePreview, "tree_preview", previews)
    const onToggleGUIPreview = this.makeTogglePreviewFunction(guiPreview, "gui_preview", previews)

    // Button bars (right)
    this.add.existing(new SpeedBar(this, 960, -4))
    this.buttonBar = new ButtonBar(this, 740, -4)
    this.buttonBar.access.towers.onClick = onToggleTowerPreview
    this.buttonBar.access.tree.onClick = onToggleTreePreview
    this.buttonBar.access.gui.onClick = onToggleGUIPreview
    this.buttonBar.access.replay.onClick = () => this.playScene.createMap()

    this.add.existing(this.buttonBar)

    makeTimelinePreviewGraphics(this)

    this.addSelectors()

    const { w } = sceneSize(this)
    this.add.existing(new TDInfoTower(this, w + 100, 75,
      this.playScene.towerGroup.selected,
      this.playScene.towerGroup.infoVisible))
    this.add.existing(new TDInfoEnemy(this, -450, 75,
      this.playScene.enemyGroup.selected,
      this.playScene.enemyGroup.infoVisible))
  }

  addSelectors() {
    const placement = new TowerPlacement(this.playScene, this)
    this.playScene.add.existing(placement)

    // Need to capture onAddTower in play scene
    this.selectors = [
      new TowerSelector(this.playScene, 0, 100, this.playScene.credits, "eject", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 200, this.playScene.credits, "beam", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 300, this.playScene.credits, "spray", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 400, this.playScene.credits, "cloud", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 500, this.playScene.credits, "vertical", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 600, this.playScene.credits, "expand", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 700, this.playScene.credits, "area", placement.onAddTower)
    ]
    for (let selector of this.selectors) {
      selector.group = this.selectors
      this.add.existing(selector)
    }
    return this.selectors
  }
}
