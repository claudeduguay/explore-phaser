import { GameObjects } from "phaser";
import TDTower from "../tower/TDTower";

export default class SelectionManager {

  selected!: TDTower

  constructor(public group: GameObjects.Group) {

  }

  select(selected: TDTower) {
    this.selected = selected
    // Clear other selections
    this.group.children.entries.forEach((t) => {
      if (t instanceof TDTower) {
        t.showSelection = false
        t.postFX?.clear()
      }
    })
    // Toggle showSelection
    selected.showSelection = !selected.showSelection
    if (selected.showSelection) {
      selected.showSelection = true
      selected.postFX?.addGlow()
    } else {
      selected.postFX?.clear()
    }
  }

  toggle(selected: TDTower) {
    this.selected = selected
    // Clear other selections
    this.group.children.entries.forEach((t) => {
      if (t instanceof TDTower) {
        t.showSelection = false
        t.postFX?.clear()
      }
    })
    // Toggle showSelection
    selected.showSelection = !selected.showSelection
    if (selected.showSelection) {
      selected.showSelection = true
      selected.postFX?.addGlow()
    } else {
      selected.postFX?.clear()
    }
  }
}
