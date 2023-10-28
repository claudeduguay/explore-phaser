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

export default class TDHUDScene extends Scene {
  buttonBar!: ButtonBar
  selectors: TowerSelector[] = []
  towerPreview!: TowerPreview
  treePreview!: TreePreview
  guiPreview!: GUIPreview

  constructor(public readonly playScene: TDPlayScene) {
    super("hud")
  }

  create() {
    // IMPORTANT: this.add is not available in constructor, so we use create() 

    // Value monitors (left)
    this.add.existing(new ValueMonitor(this, 10, 7, 0xe87d, "red", this.playScene.health))
    this.add.existing(new ValueMonitor(this, 120, 7, 0xe227, "green", this.playScene.credits))

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

    const onToggleGUIPreview = () => {
      if (this.scene.isActive("gui_preview")) {
        this.scene.sleep("gui_preview")
      } else {
        this.scene.wake("gui_preview")
      }
    }
    this.guiPreview = new GUIPreview(this, 50, 50)
    this.scene.add("gui_preview", this.guiPreview, true)
    this.scene.sleep("gui_preview")


    // Button bars (right)
    this.add.existing(new SpeedBar(this, 970, -4))
    this.buttonBar = new ButtonBar(this, 740, -4)
    this.buttonBar.access.towers.onClick = onToggleTowerPreview
    this.buttonBar.access.tree.onClick = onToggleTreePreview
    this.buttonBar.access.gui.onClick = onToggleGUIPreview
    this.add.existing(this.buttonBar)
  }

  addSelectors(placement: TowerPlacement) {
    // Need to capture onAddTower in play scene
    this.selectors = [
      new TowerSelector(this.playScene, 0, 100, "eject", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 200, "beam", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 300, "spray", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 400, "cloud", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 500, "vertical", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 600, "expand", placement.onAddTower),
      new TowerSelector(this.playScene, 0, 700, "area", placement.onAddTower)
    ]
    for (let selector of this.selectors) {
      selector.group = this.selectors
      this.add.existing(selector)
    }
    return this.selectors
  }
}
