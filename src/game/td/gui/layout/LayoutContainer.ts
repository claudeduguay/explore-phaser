import { GameObjects, Scene } from "phaser";
import ILayout from "./ILayout";

// A LayoutContainer has an ILayout manager that triggers whenever the children
// list changes. Layouts act on visible objects to arrange them within the view area.
// This version does not monitor child visibility but such a behavior may be desirable.
// Not all mutation calls may be accounted for (I skipped move variaitons, for example)

export default class LayoutContainer extends GameObjects.Container {

  constructor(scene: Scene, x: number, y: number, public layout: ILayout) {
    super(scene, x, y)
  }

  // add<T extends Phaser.GameObjects.GameObject>(child: (T | T[])): this {
  //   super.add(child)
  //   this.triggerLayout()
  //   return this
  // }

  // addAt<T extends Phaser.GameObjects.GameObject>(child: (T | T[]), index?: number): this {
  //   super.addAt(child, index)
  //   this.triggerLayout()
  //   return this
  // }

  // sort(property: string, handler?: Function): this {
  //   super.sort(property, handler)
  //   return this
  // }

  // // Assuming all move functions rely on this one?
  // moveTo<T extends Phaser.GameObjects.GameObject>(child: T, index: number): this {
  //   super.moveTo(child, index)
  //   return this
  // }

  // remove<T extends Phaser.GameObjects.GameObject>(child: (T | T[]), destroyChild?: boolean): this {
  //   super.remove(child, destroyChild)
  //   this.triggerLayout()
  //   return this
  // }

  // removeBetween(startIndex?: number, endIndex?: number, destroyChild?: boolean): this {
  //   super.removeBetween(startIndex, endIndex, destroyChild)
  //   this.triggerLayout()
  //   return this
  // }

  // removeAt(index: number, destroyChild?: boolean): this {
  //   super.removeAt(index, destroyChild)
  //   this.triggerLayout()
  //   return this
  // }

  // removeAll(destroyChild?: boolean): this {
  //   super.removeAll(destroyChild)
  //   this.triggerLayout()
  //   return this
  // }

  // replace<T extends Phaser.GameObjects.GameObject>(oldChild: T, newChild: T, destroyChild?: boolean): this {
  //   super.replace(oldChild, newChild, destroyChild)
  //   this.triggerLayout()
  //   return this
  // }

  // setSize(width: number, height: number): this {
  //   super.setSize(width, height)
  //   this.triggerLayout()
  //   return this
  // }

  // setDisplaySize(width: number, height: number): this {
  //   super.setDisplaySize(width, height)
  //   // this.triggerLayout()
  //   return this
  // }

  triggerLayout() {
    this.layout.apply(this)
  }
}

export function registerLayoutFactory() {
  GameObjects.GameObjectFactory.register("layout",
    function (this: GameObjects.GameObjectFactory, x: number, y: number, layout: ILayout): LayoutContainer {
      const container = new LayoutContainer(this.scene, x, y, layout)
      this.displayList.add(container)
      return container
    }
  )
}