import { GameObjects, Scene } from "phaser"
import ObservableValue from "../../value/ObservableValue"
import { pointOnCircle, radial } from "../Radial"
import { TYPES_DAMAGE, TYPES_DELIVERY } from "../../entity/model/ITowerData"
import { GENERATED_LIST } from "../../entity/model/ITowerModel"
import TDTower from "../../entity/tower/TDTower"

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

    const onUpdateTowerView = () => {
      choices.list.forEach((tower, i) => {
        if (tower instanceof TDTower) {
          const a = Math.atan2(tower.y, tower.x)
          const pos = pointOnCircle(a, cx)
          scene.add.tween({
            targets: tower,
            duration: 500,
            alpha: 0,
            x: pos.x,
            y: pos.y,
            onComplete: () => choices.remove(tower, true),
          })
        }
      })
      const towers = GENERATED_LIST.filter(({ organize: { delivery, damage } }) => {
        return observableDelivery.value ? delivery === observableDelivery.value : true &&
          observableDamage.value ? damage === observableDamage.value : true
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
          const tower = scene.add.tower(0, 0, towers[i])
          tower.alpha = 0
          scene.add.tween({
            targets: tower,
            duration: 500,
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
