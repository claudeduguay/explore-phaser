import { GameObjects, Scene } from "phaser"
import ITowerModel from "../entity/model/ITowerModel"
import TDTower from "../entity/tower/TDTower"
import TowerSelector from "./TowerSelector"
import { DEFAULT_FONT_FAMILY } from "../gui/Label"
import { DEFAULT_STYLE } from "../gui/Icon"

export default class TowerSelectorBar extends GameObjects.Container {

  constructor(scene: Scene, x: number, y: number, selector: TowerSelector, public models: ITowerModel[], public onAddTower: (model: ITowerModel) => void) {
    super(scene, x, y)
    models.forEach((model, i) => this.addTowerButton(selector, model, 50 + i * 100, 0))
    this.visible = false
  }

  addTowerButton(selector: TowerSelector, model: ITowerModel, x: number, y: number) {
    const onClick = () => {
      selector.isOpen = false
      this.onAddTower(model)
    }
    const button = this.scene.add.button(x, y, 100, 100, ``, "flat", onClick)
    const tower = new TDTower(this.scene, 0, -8, model, true)
    tower.platform.removeInteractive()
    button.add(tower)
    button.add(this.scene.add.text(0, 28, model.name, {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontSize: 14,
      color: "#99FF99"
    }).setOrigin(0.5, 0))

    // Disabled but functional (clicking on a locked entry should:
    // * Check we have enough cash
    // * Deduct the cash and set the tower to locked: false
    // * If successful, we can call onAddTower
    // )
    if (model.locked && false) {
      button.add(this.scene.add.icon(0, -14, 0xe897, {
        ...DEFAULT_STYLE,
        fontSize: 42,
        color: "orange",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "black",
          fill: true
        }
      }).setOrigin(0.5))
      button.add(this.scene.add.text(0, 0, `$${model.stats.cost}`, {
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: 18,
        color: "orange",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "black",
          fill: true
        }
      }).setOrigin(0.5, 0))
    }

    this.add(button)
  }

}
