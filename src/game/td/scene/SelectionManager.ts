import { GameObjects } from "phaser";
import TDTower from "../tower/TDTower";
import ObservableValue from "../value/ObservableValue";

export default class SelectionManager {

  selected?: TDTower

  constructor(
    public group: GameObjects.Group,
    public selectedTower: ObservableValue<TDTower | undefined>,
    public towerInfoVisible: ObservableValue<boolean>) {
  }

  select(selected?: TDTower) {
    if (selected) {
      this.selected = selected
      this.selectedTower.value = selected
    }
    // Clear other selections
    this.group.children.entries.forEach((tower) => {
      if (tower instanceof TDTower) {
        tower.tower_base.postFX?.clear()
      }
    })
    if (selected) {
      selected.tower_base.postFX?.addGlow()
      this.towerInfoVisible.adjust(true)
    }
  }
}
