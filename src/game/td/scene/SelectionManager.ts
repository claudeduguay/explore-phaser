import { GameObjects } from "phaser";
import TDTower from "../tower/TDTower";
import ObservableValue from "../value/ObservableValue";

export default class SelectionManager<T> {

  selected?: T

  constructor(
    public group: GameObjects.Group,
    public selectedTower: ObservableValue<T | undefined>,
    public towerInfoVisible: ObservableValue<boolean>) {
  }

  select(selected?: T) {
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
      if (selected instanceof TDTower) {
        selected.tower_base.postFX?.addGlow()
      }
      this.towerInfoVisible.adjust(true)
    }
  }
}
