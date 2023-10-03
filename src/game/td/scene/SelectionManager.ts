import { GameObjects } from "phaser";
import TDTower from "../tower/TDTower";
import ObservableValue from "../value/ObservableValue";

export default class SelectionManager {

  selected!: TDTower

  constructor(public group: GameObjects.Group,
    public selectedTower: ObservableValue<TDTower | undefined>,
    public towerInfoVisible: ObservableValue<boolean>) {
  }

  select(selected: TDTower) {
    this.selected = selected
    this.selectedTower.adjust(selected)
    // Clear other selections
    this.group.children.entries.forEach((t) => {
      if (t instanceof TDTower) {
        t.showSelection = false
        t.tower_base.postFX?.clear()
      }
    })
    // Toggle showSelection
    selected.showSelection = !selected.showSelection
    if (selected.showSelection) {
      selected.showSelection = true
      selected.tower_base.postFX?.addGlow()
    } else {
      selected.tower_base.postFX?.clear()
    }
  }

  toggle(selected: TDTower) {
    this.selected = selected
    this.selectedTower.adjust(selected)
    // Clear other selections
    this.group.children.entries.forEach((t) => {
      if (t instanceof TDTower) {
        t.showSelection = false
        t.tower_base.postFX?.clear()
      }
    })
    // Toggle showSelection
    selected.showSelection = !selected.showSelection
    if (selected.showSelection) {
      selected.showSelection = true
      selected.tower_base.postFX?.addGlow()
    } else {
      selected.tower_base.postFX?.clear()
    }
    this.towerInfoVisible.adjust(true)
  }
}
