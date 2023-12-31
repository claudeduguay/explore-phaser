import { GameObjects, Physics, Scene } from "phaser";
import ObservableValue from "../value/ObservableValue";

export interface ISelectable extends GameObjects.GameObject {
  addSelectHandler(select: (selection: any) => void): void
  removeSelectHandler(): void
  showSelection(): void
  hideSelection(): void
}

export default class SelectableGroup<T extends ISelectable> extends Physics.Arcade.Group {

  printErrors = false
  infoVisible = new ObservableValue<boolean>(false)
  selected = new ObservableValue<T | undefined>(undefined)

  onCloseInfo = () => this.infoVisible.value = false

  constructor(scene: Scene, key: string) {
    super(scene.physics.world, scene, { key })
    // @ts-ignore
    scene.physics.add.existing(this)
  }

  onChildDestroyed = (e: T) => {
    if (this.selected.value === e) {
      this.select(undefined)
    }
  }

  add(child: ISelectable, addToScene?: boolean) {
    if (child.addSelectHandler) {
      child.addSelectHandler(this.select)
      super.add(child, addToScene)
      child.addListener(GameObjects.Events.DESTROY, this.onChildDestroyed)
    } else if (this.printErrors) {
      console.warn("Add error (not added to group):", child)
    }
    return this
  }

  remove(child: ISelectable, removeFromScene?: boolean, destroyChild?: boolean) {
    if (child.removeSelectHandler) {
      child.removeSelectHandler()
      super.remove(child, removeFromScene, destroyChild)
      child.removeListener(GameObjects.Events.DESTROY, this.onChildDestroyed)
    } else if (this.printErrors) {
      console.warn("Remove error (not removed from group):", child)
    }
    return this
  }

  // >>> Use a lambda expression to capture context during event-handling <<<
  select = (selection?: T) => {
    this.selected.value = selection

    // Clear other selections
    this.children.entries.forEach((item: any) => {
      if (item.hideSelection) {
        item.hideSelection()
      }
    })

    this.infoVisible.value = !!selection
  }
}
