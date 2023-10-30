import { Scene } from "phaser";
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

export default class TDHUDScene extends Scene {
  buttonBar!: ButtonBar
  selectors: TowerSelector[] = []
  towerPreview!: TowerPreview
  treePreview!: TreePreview
  guiPreview!: GUIPreview

  constructor(public readonly playScene: TDPlayScene) {
    super("hud")
  }

  makeTogglePreviewFunction(scene: Scene, key: string) {
    return () => {
      if (!this.scene.get(key)) {
        this.scene.add(key, scene, true)
        return
      }
      if (this.scene.isActive(key)) {
        this.scene.sleep(key)
      } else {
        this.scene.wake(key)
      }
    }
  }

  create() {
    // IMPORTANT: this.add is not available in constructor, so we use create() 

    // Value monitors (left)
    this.add.existing(new ValueMonitor(this, 10, 7, 0xe87d, "red", this.playScene.health))
    this.add.existing(new ValueMonitor(this, 120, 7, 0xe227, "green", this.playScene.credits))

    this.towerPreview = new TowerPreview(this, 50, 50)
    const onToggleTowerPreview = this.makeTogglePreviewFunction(this.towerPreview, "tower_preview")

    this.treePreview = new TreePreview(this, 50, 50)
    const onToggleTreePreview = this.makeTogglePreviewFunction(this.treePreview, "tree_preview")

    this.guiPreview = new GUIPreview(this, 50, 50)
    const onToggleGUIPreview = this.makeTogglePreviewFunction(this.guiPreview, "gui_preview")

    // Button bars (right)
    this.add.existing(new SpeedBar(this, 970, -4))
    this.buttonBar = new ButtonBar(this, 740, -4)
    this.buttonBar.access.towers.onClick = onToggleTowerPreview
    this.buttonBar.access.tree.onClick = onToggleTreePreview
    this.buttonBar.access.gui.onClick = onToggleGUIPreview
    this.add.existing(this.buttonBar)

    makeTimelinePreviewGraphics(this)
  }

  addSelectors(placement: TowerPlacement) {
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
