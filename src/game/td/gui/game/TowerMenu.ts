import { Curves, GameObjects, Scene } from "phaser"
import ObservableValue from "../../value/ObservableValue"
import { radial } from "../Radial"
import { TYPES_DAMAGE, TYPES_DELIVERY } from "../../entity/model/ITowerData"
import ITowerModel, { GENERATED_LIST } from "../../entity/model/ITowerModel"

export default class TowerMenu extends GameObjects.Container {
  constructor(scene: Scene, cx: number, cy: number) {
    super(scene, cx, cy)
    const observableDelivery = new ObservableValue<string | undefined>(undefined)
    const deliveryMenu = radial(scene, 0, 0, 320, TYPES_DELIVERY, observableDelivery)
    this.add(deliveryMenu)

    const observableDamage = new ObservableValue<string | undefined>(undefined)
    const damageMenu = radial(scene, 0, 0, 285, TYPES_DAMAGE, observableDamage)
    this.add(damageMenu)

    const choices = scene.add.container(0, 0)
    this.add(choices)

    const perimiter = new Curves.Path()
    perimiter.moveTo(-cx, -cy)
    perimiter.lineTo(cx, -cy)
    perimiter.lineTo(cx, cy)
    perimiter.lineTo(-cx, cy)

    const onUpdateTowerView = () => {
      choices.list.forEach((tower, i) => {
        // const f = i / (choices.list.length - 1)
        const pos = perimiter.getPoint(Math.random())
        scene.add.tween({
          targets: tower,
          duration: 1000,
          alpha: 0,
          x: pos.x,
          y: pos.y,
          onComplete: () => choices.remove(tower, true),
        })
      })
      // choices.removeAll(true)
      const towers = GENERATED_LIST.filter((t: ITowerModel) => {
        if (observableDelivery.value && observableDamage.value) {
          return t.organize.delivery === observableDelivery.value &&
            t.organize.damage === observableDamage.value
        }
        if (observableDelivery.value) {
          return t.organize.delivery === observableDelivery.value
        }
        if (observableDamage.value) {
          return t.organize.damage === observableDamage.value
        }
        return true
      })
      if (towers.length === 1) {
        choices.add(scene.add.tower(0, 0, towers[0]))
        return
      }
      for (let iy = 0; iy < 4; iy++) {
        for (let ix = 0; ix < 4; ix++) {
          const i = ix + iy * 4
          const x = ix * 100 - 150
          const y = iy * 100 - 150
          const xx = 0 // lerp(-w, w, Math.random())
          const yy = 0 // lerp(-h, h, Math.random())
          const tower = scene.add.tower(xx, yy, towers[i])
          tower.alpha = 0
          scene.add.tween({
            targets: tower,
            duration: 500,
            delay: 500,
            alpha: 1,
            x,
            y,
          })
          choices.add(tower)
        }
      }
    }

    observableDelivery.addListener("changed", () => {
      observableDamage.value = undefined
      onUpdateTowerView()
    })
    observableDamage.addListener("changed", () => {
      observableDelivery.value = undefined
      onUpdateTowerView()
    })
  }
}
