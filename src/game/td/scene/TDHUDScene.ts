import { Scene } from "phaser";
import TDGameScene from "./TDGameScene";
import ObservableValue from "../value/ObservableValue";
import SpeedBar from "../gui/game/SpeedBar";
import ValueMonitor from "../gui/game/ValueMonitor";
import ButtonBar from "../gui/game/ButtonBar";
import TowerPreview from "../entity/tower/TowerPreview";
import GUIPreview from "../gui/GUIPreview";
import TreePreview from "../tree/TreePreview";
import TowerSelector from "./TowerSelector";

export default class TDHUDScene extends Scene {
  buttonBar!: ButtonBar
  selectors: TowerSelector[] = []
  towerPreview!: TowerPreview
  treePreview!: TreePreview
  guiPreview!: GUIPreview

  constructor(public readonly main: TDGameScene,
    public health: ObservableValue<number>,
    public credits: ObservableValue<number>) {
    super("hud")
  }

  create() {
    // IMPORTANT: this.add is not available in constructor, so we use create() 

    // Value monitors (left)
    this.add.existing(new ValueMonitor(this, 10, 5, 0xe87d, "red", this.health))
    this.add.existing(new ValueMonitor(this, 120, 5, 0xe227, "green", this.credits))

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
    this.add.existing(new SpeedBar(this, 960, 12))
    this.buttonBar = new ButtonBar(this, 730, 12)
    this.buttonBar.access.towers.onClick = onToggleTowerPreview
    this.buttonBar.access.tree.onClick = onToggleTreePreview
    this.buttonBar.access.gui.onClick = onToggleGUIPreview
    this.add.existing(this.buttonBar)
  }

  addSelectors(selectors: TowerSelector[]) {
    this.selectors = selectors
    for (let selector of selectors) {
      selector.group = selectors
      this.add.existing(selector)
    }
  }
}
