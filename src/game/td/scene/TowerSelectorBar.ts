import { GameObjects, Scene } from "phaser"
import ITowerModel from "../entity/model/ITowerModel"
import TDTower from "../entity/tower/TDTower"

export default class TowerSelectorBar extends GameObjects.Container {

  constructor(scene: Scene, x: number, y: number, public models: ITowerModel[]) {
    super(scene, x, y)
    models.forEach((model, i) => this.addTowerButton(model, 40 + i * 80, 0))
  }

  addTowerButton(model: ITowerModel, x: number, y: number) {
    console.log("Model:", model.name)
    const button = this.scene.add.button(x, y, 80, 80, ``, "flat", () => console.log(`${model.name} Tower Button clicked`))
    const tower = new TDTower(this.scene, 0, 0, model, true)
    tower.platform.removeInteractive()
    button.add(tower)
    this.add(button)
  }

}
