import { GameObjects, Scene } from "phaser"
import ITowerModel from "../entity/model/ITowerModel"
import TDTower from "../entity/tower/TDTower"
import TowerSelector from "./TowerSelector"

export default class TowerSelectorBar extends GameObjects.Container {

  constructor(scene: Scene, x: number, y: number, selector: TowerSelector, public models: ITowerModel[], public onAddTower: (model: ITowerModel) => void) {
    super(scene, x, y)
    models.forEach((model, i) => this.addTowerButton(selector, model, 40 + i * 80, 0))
  }

  addTowerButton(selector: TowerSelector, model: ITowerModel, x: number, y: number) {
    console.log("Model:", model.name)
    const onClick = () => {
      console.log(`${model.name} Tower Button clicked`)
      selector.isOpen = false
      this.onAddTower(model)
    }
    const button = this.scene.add.button(x, y, 80, 80, ``, "flat", onClick)
    const tower = new TDTower(this.scene, 0, 0, model, true)
    tower.platform.removeInteractive()
    button.add(tower)
    this.add(button)
  }

}
